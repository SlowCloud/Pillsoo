package org.sos.pillsoo.auth.jwt.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.auth.entity.RefreshEntity;
import org.sos.pillsoo.auth.jwt.JWTUtil;
import org.sos.pillsoo.auth.repository.RefreshRepository;
import org.sos.pillsoo.auth.repository.UserRepository;
import org.sos.pillsoo.exception.PillSooException;
import org.sos.pillsoo.exception.errorCode.UserErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.sos.pillsoo.auth.entity.User;

import java.util.Date;

public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    public static final int ACCESS_TOKEN_EXPIRED_MS = 1000L * 60 * 60;
    public static final int REFRESH_TOKEN_EXPIRED_MS = 1000L * 60 * 60 * 12;
    public static final String FCM_TOKEN = "fcmToken";
    private final JWTUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final RefreshRepository refreshRepository;
    private final UserRepository userRepository;

    public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil, RefreshRepository refreshRepository, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = obtainUsername(request);
        String password = obtainPassword(request);

        String fcmToken = request.getParameter(FCM_TOKEN);

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
        return authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        String userId = customUserDetails.getUsername();
        String role = customUserDetails.getAuthorities().iterator().next().getAuthority();
        int userSeq = customUserDetails.getUserSeq();  // userSeq를 가져옴
        String nickname = customUserDetails.getUserNickname();
        String gender = customUserDetails.getUserGender();
        int age = customUserDetails.getUserAge();

        String fcmToken = request.getParameter(FCM_TOKEN);

        // FCM 토큰을 사용자 정보에 저장.
        // 차후에 로그인 할 때 fcmToken 없으면 로그인 못하도록 바꾸던가 하는게 좋을 듯?
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new PillSooException(UserErrorCode.USER_NOT_FOUND);
        }
        user.setFcmToken(fcmToken);
        userRepository.save(user);

        String accessToken = jwtUtil.createJwt("access", role, userId, userSeq, nickname, gender, age, ACCESS_TOKEN_EXPIRED_MS); // 1시간
        String refreshToken = jwtUtil.createJwt("refresh", role, userId, userSeq, nickname, gender, age, REFRESH_TOKEN_EXPIRED_MS); // 12시간

        addRefreshEntity(userId, refreshToken, REFRESH_TOKEN_EXPIRED_MS);

        response.setHeader("access", accessToken);
        response.addCookie(createRefreshTokenCookie(refreshToken));
        response.setStatus(HttpStatus.OK.value());

        System.out.println("successful authentication" + "accessToken is " + accessToken + ", refreshToken is " + refreshToken);

    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

    private Cookie createRefreshTokenCookie(String token) {
        return createCookie("refresh", token);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(REFRESH_TOKEN_EXPIRED_MS);
        cookie.setHttpOnly(true);
        return cookie;
    }

    private void addRefreshEntity(String userId, String refresh, int expiredMs) {
        Date date = new Date(System.currentTimeMillis() + expiredMs);

        RefreshEntity refreshEntity = new RefreshEntity();

        refreshEntity.setUserId(userId);
        refreshEntity.setRefreshToken(refresh);
        refreshEntity.setExpiration(date.toString());

        refreshRepository.save(refreshEntity);
    }
}

package org.sos.pillsoo.jwt;

import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.auth.repository.RefreshRepository;
import org.sos.pillsoo.auth.service.CustomUserDetailsService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@RequiredArgsConstructor
@Component
public class RefreshTokenFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // access token이 살아있으면 넘긴다.
        String accessToken = extractAccessToken(request);
        if (accessToken != null && !jwtUtil.isExpired(accessToken)) {
            filterChain.doFilter(request, response);
            return;
        }

        // refresh token이 죽었으면 넘긴다.
        String refreshToken = extractRefreshToken(request);
        if (refreshToken == null || jwtUtil.isExpired(refreshToken)) {
            filterChain.doFilter(request, response);
            return;
        }

//        // 해당 refresh token이 존재하지 않으면 넘긴다.
//        // 근데 이거 왜 하는거지
//        if(!refreshRepository.existsByRefreshToken(refreshToken)) {
//            filterChain.doFilter(request, response);
//            return;
//        }

        // refresh token이 살아 있으므로, access token을 재발급하고 넘긴다.
        String userId = jwtUtil.getUserId(refreshToken);
        String role = jwtUtil.getRole(refreshToken);
        int userSeq = jwtUtil.getUserSeq(refreshToken);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access",  role, userId, userSeq,  600000L);
        String newRefresh = jwtUtil.createJwt("refresh", role, userId, userSeq,  100000000L);

//        refreshRepository.deleteByRefreshToken(refreshToken);
//        addRefreshEntity(userId, newRefresh, 8640000L);

        response.setHeader("access", newAccess);
        response.addCookie(new Cookie("refresh", newRefresh));

        // User 객체 생성
        User userEntity = new User();
        userEntity.setUserSeq(userSeq);
        userEntity.setUserId(userId);
        userEntity.setRole(role);

        // CustomUserDetails에 User 정보 저장
        CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);

    }

    private String extractRefreshToken(HttpServletRequest request) {
        Cookie cookie = Arrays.stream(request.getCookies()).filter(c -> c.getName().equals("refresh")).findFirst().orElse(null);
        if (cookie == null) return null;
        return cookie.getValue();
    }

    private String extractAccessToken(HttpServletRequest request) {
        return request.getHeader("access");
    }
}

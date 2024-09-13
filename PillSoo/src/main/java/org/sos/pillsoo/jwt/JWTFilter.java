package org.sos.pillsoo.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.auth.entity.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);  // "Bearer " 이후의 토큰 추출

        try {
            if (jwtUtil.isExpired(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("JWT expired. Please refresh your token.");
                return;
            }

            // JWT에서 userSeq와 userId 추출
            int userSeq = jwtUtil.getUserSeq(token);
            String userId = jwtUtil.getUserId(token);
            String role = jwtUtil.getRole(token);

            System.out.println("Extracted userSeq from JWT: " + userSeq);  // 디버그 로그

            // User 객체 생성
            User userEntity = new User();
            userEntity.setUserSeq(userSeq);
            userEntity.setUserId(userId);
            userEntity.setRole(role);

            // CustomUserDetails에 User 정보 저장
            CustomUserDetails customUserDetails = new CustomUserDetails(userEntity);
            Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (Exception e) {
            System.out.println("JWT parsing error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}

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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        System.out.println("doFilterInternal start");
        String authorizationHeader = request.getHeader("Authorization");

        if(authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            System.out.println("JWT 토큰 없음 -> 종료");
            filterChain.doFilter(request, response);
            System.out.println("filterChain.doFilter end");

            return ;
        }

        String token = authorizationHeader.split(" ")[1];

        if(jwtUtil.isExpired(token)) {
            System.out.println("토큰 만료됨");
            filterChain.doFilter(request, response);

            return;
        }

        String role = jwtUtil.getRole(token);
        String userId = jwtUtil.getUserId(token);

        User userEntity = new User();
        userEntity.setRole(role);
        userEntity.setUserId(userId);
        userEntity.setPassword("temppassword");

        CustomUserDetails customUserDetails =new CustomUserDetails(userEntity);
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());

        SecurityContextHolder .getContext().setAuthentication(authToken);
        filterChain.doFilter(request, response);
    }
}


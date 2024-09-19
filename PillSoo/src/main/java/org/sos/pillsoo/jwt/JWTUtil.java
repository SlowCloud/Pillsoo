package org.sos.pillsoo.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JWTUtil {

    private final SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    // JWT 생성 메서드 (userSeq 포함)
    public String createJwt(String role, String userId, int userSeq, long expiredMs) {
        return Jwts.builder()
                .claim("role", role)
                .claim("userId", userId)
                .claim("userSeq", userSeq)  // userSeq 포함
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))  // 만료 시간 설정
                .signWith(secretKey)  // 서명 생성
                .compact();
    }

    private Claims getPayload(String token) {
        return Jwts.parser()  // parser() 사용
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // JWT에서 userSeq 추출
    public int getUserSeq(String token) {
        return getPayload(token).get("userSeq", Integer.class);  // userSeq 추출
    }

    // JWT에서 userId 추출
    public String getUserId(String token) {
        return getPayload(token).get("userId", String.class);  // userId 추출
    }

    // JWT에서 role 추출
    public String getRole(String token) {
        return getPayload(token).get("role", String.class);  // role 추출
    }

    // JWT 만료 여부 확인
    public boolean isExpired(String token) {
        Date expiration = getPayload(token)
                .getExpiration();
        return expiration.before(new Date());
    }
}

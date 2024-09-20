package org.sos.pillsoo.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JWTUtil {

    private final SecretKey secretKey;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());
    }



    public String getCategory(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

    // JWT에서 userSeq 추출
    public int getUserSeq(String token) {
        return Jwts.parser()  // parser() 사용
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("userSeq", Integer.class);  // userSeq 추출
    }

    // JWT에서 userId 추출
    public String getUserId(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("userId", String.class);  // userId 추출
    }

    // JWT에서 role 추출
    public String getRole(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);  // role 추출
    }

    // JWT 만료 여부 확인
    public boolean isExpired(String token) {
        Date expiration = Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }

    // JWT 생성 메서드 (userSeq 포함)
    public String createJwt(String category, String role, String userId, int userSeq, long expiredMs) {
        return Jwts.builder()
                .claim("category", category)
                .claim("role", role)
                .claim("userId", userId)
                .claim("userSeq", userSeq)  // userSeq 포함
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs))  // 만료 시간 설정
                .signWith(SignatureAlgorithm.HS256, secretKey)  // 서명 생성
                .compact();
    }
}

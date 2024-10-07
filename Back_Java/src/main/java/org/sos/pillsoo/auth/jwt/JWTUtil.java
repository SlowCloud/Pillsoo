package org.sos.pillsoo.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
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

    private Claims getVerifiedPayload(String token) {
        return Jwts.parser()  // parser() 사용
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getCategory(String token) {
        return getVerifiedPayload(token).get("category", String.class);
    }

    // JWT에서 userSeq 추출
    public int getUserSeq(String token) {
        return getVerifiedPayload(token).get("userSeq", Integer.class);  // userSeq 추출
    }

    // JWT에서 userId 추출
    public String getUserId(String token) {
        return getVerifiedPayload(token).get("userId", String.class);  // userId 추출
    }

    // JWT에서 role 추출
    public String getRole(String token) {
        return getVerifiedPayload(token).get("role", String.class);  // role 추출
    }

    // JWT에서 nickname 추출
    public String getNickname(String token) {
        return getVerifiedPayload(token).get("nickname", String.class);  // role 추출
    }

    // JWT에서 age 추출
    public int getAge(String token) {
        var payload = getVerifiedPayload(token);
        return payload.get("age", Integer.class);  // role 추출
    }

    // JWT에서 gender 추출
    public String getGender(String token) {
        return getVerifiedPayload(token).get("gender", String.class);  // role 추출
    }

    // JWT 만료 여부 확인
    public boolean isExpired(String token) {
//        Date expiration = getVerifiedPayload(token).getExpiration();
//        return expiration.before(new Date());
        try {
            getVerifiedPayload(token);
            return false;
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    // JWT 생성 메서드 (userSeq 포함)
    public String createJwt(String category, String role, String userId, int userSeq, String nickname, String gender, int age, long expiredMs) {
        return Jwts.builder()
                .claim("category", category)
                .claim("role", role)
                .claim("userId", userId)
                .claim("userSeq", userSeq)  // userSeq 포함
                .claim("nickname", nickname)
                .claim("gender", gender)
                .claim("age", age)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))  // 만료 시간 설정
                .signWith(secretKey)  // 서명 생성
                .compact();
    }
}

package org.sos.pillsoo.auth.service;

import io.jsonwebtoken.ExpiredJwtException;
import org.sos.pillsoo.auth.entity.RefreshEntity;
import org.sos.pillsoo.auth.repository.RefreshRepository;
import org.sos.pillsoo.jwt.JWTUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ReissueService {

    private final JWTUtil jwtUtil;
    private final RefreshRepository refreshRepository;

    public ReissueService(JWTUtil jwtUtil, RefreshRepository refreshRepository) {
        this.jwtUtil = jwtUtil;
        this.refreshRepository = refreshRepository;
    }

    public ReissueResult reissueTokens(String refresh) throws ReissueException {
        //expired check
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            throw new ReissueException("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(refresh);

        if (!category.equals("refresh")) {
            throw new ReissueException("invalid refresh token", HttpStatus.BAD_REQUEST);
        }

        boolean isExist = refreshRepository.existsByRefreshToken(refresh);
        if (!isExist) {
            throw new ReissueException("refresh token not found", HttpStatus.NOT_FOUND);
        }

        String userId = jwtUtil.getUserId(refresh);
        String role = jwtUtil.getRole(refresh);
        int userSeq = jwtUtil.getUserSeq(refresh);

        //make new JWT
        String newAccess = jwtUtil.createJwt("access",  role, userId, userSeq,  600000L);
        String newRefresh = jwtUtil.createJwt("refresh", role, userId, userSeq,  100000000L);

        refreshRepository.deleteByRefreshToken(refresh);
        addRefreshEntity(userId, newRefresh, 8640000L);

        return new ReissueResult(newAccess, newRefresh);
    }

    private void addRefreshEntity(String userId, String refresh, Long expiredMs) {
        Date date = new Date(System.currentTimeMillis() + expiredMs);

        RefreshEntity refreshEntity = new RefreshEntity();

        refreshEntity.setUserId(userId);
        refreshEntity.setRefreshToken(refresh);
        refreshEntity.setExpiration(date.toString());

        refreshRepository.save(refreshEntity);
    }

    public static class ReissueResult {
        private final String newAccess;
        private final String newRefresh;

        public ReissueResult(String newAccess, String newRefresh) {
            this.newAccess = newAccess;
            this.newRefresh = newRefresh;
        }

        public String getNewAccess() {
            return newAccess;
        }

        public String getNewRefresh() {
            return newRefresh;
        }
    }

    public static class ReissueException extends Exception {
        private final HttpStatus status;

        public ReissueException(String message, HttpStatus status) {
            super(message);
            this.status = status;
        }

        public HttpStatus getStatus() {
            return status;
        }
    }
}

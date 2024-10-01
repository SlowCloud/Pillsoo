package org.sos.pillsoo.auth.repository;

import jakarta.transaction.Transactional;
import org.sos.pillsoo.auth.entity.RefreshEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshRepository extends JpaRepository<RefreshEntity, Long> {

    Boolean existsByRefreshToken(String refreshToken);

    @Transactional
    void deleteByRefreshToken(String refreshToken);

}

package org.sos.pillsoo.auth.repository;

import org.sos.pillsoo.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Boolean existsByUserId(String userId);
    User findByUserId(String userId);

    // 추가: userSeq로 User를 찾는 메서드
    User findByUserSeq(int userSeq);
}

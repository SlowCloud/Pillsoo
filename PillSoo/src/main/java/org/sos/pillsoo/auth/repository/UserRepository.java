package org.sos.pillsoo.auth.repository;

import org.sos.pillsoo.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
    Boolean existsByUserId(String userId);
}

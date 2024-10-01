package org.sos.pillsoo.supplement.repository;

import org.sos.pillsoo.supplement.entity.Supplement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplementRepository extends JpaRepository<Supplement, Integer> {
    Page<Supplement> findByPillNameContaining(String searchtext, Pageable pageable);  // 페이지네이션 추가
}

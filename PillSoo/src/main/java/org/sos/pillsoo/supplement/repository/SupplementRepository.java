package org.sos.pillsoo.supplement.repository;

import org.sos.pillsoo.supplement.entity.Supplement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SupplementRepository extends JpaRepository<Supplement, Integer> {
    List<Supplement> findByPillNameContaining(String searchtext);  // 검색을 위한 메서드
}

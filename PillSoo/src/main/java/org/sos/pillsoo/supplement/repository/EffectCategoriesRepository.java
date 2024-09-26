package org.sos.pillsoo.supplement.repository;

import org.sos.pillsoo.supplement.entity.EffectCategories;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EffectCategoriesRepository extends JpaRepository<EffectCategories, Integer> {
    Page<EffectCategories> findByEffectName(String effectName, Pageable pageable);  // 페이지네이션 추가
}

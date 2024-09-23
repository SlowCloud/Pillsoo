package org.sos.pillsoo.supplement.repository;

import org.sos.pillsoo.supplement.entity.EffectCategories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EffectCategoriesRepository extends JpaRepository<EffectCategories, Integer> {
    List<EffectCategories> findByEffectName(String effectName);  // effect_name으로 검색하는 메서드
}

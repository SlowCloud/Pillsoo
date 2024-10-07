package org.sos.pillsoo.supplement.repository;

import org.sos.pillsoo.supplement.entity.ClickCount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClickCountRepository extends JpaRepository<ClickCount, Long> {
}

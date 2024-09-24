package org.sos.pillsoo.supplement.repository;

import org.sos.pillsoo.supplement.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findBySupplement_SupplementSeq(int supplementSeq);

    void deleteBySupplement_SupplementSeqAndUserSeq(int supplementSeq, int userSeq);

    List<Review> findByUserSeq(int userSeq);  // 사용자 리뷰 조회용 메서드
}

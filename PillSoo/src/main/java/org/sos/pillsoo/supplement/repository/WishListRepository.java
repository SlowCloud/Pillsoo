package org.sos.pillsoo.supplement.repository;

import org.sos.pillsoo.supplement.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishListRepository extends JpaRepository<WishList, Long> {
    List<WishList> findByUser_UserSeq(int userSeq);
    boolean existsByUser_UserSeqAndSupplement_SupplementSeq(int userSeq, int supplementSeq);
    void deleteByUser_UserSeqAndSupplement_SupplementSeq(int userSeq, int supplementSeq);
}

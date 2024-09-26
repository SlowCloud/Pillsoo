package org.sos.pillsoo.mykit.repository;

import org.sos.pillsoo.mykit.entity.MyKit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MyKitRepository extends JpaRepository<MyKit, Integer> {
    List<MyKit> findByUser_UserSeq(int userSeq);

    Optional<MyKit> findByUser_UserSeqAndSupplement_SupplementSeq(int userSeq, int supplementSeq);

    void deleteByUser_UserSeqAndSupplement_SupplementSeq(int userSeq, int supplementSeq);
}

package org.sos.pillsoo.mykit.repository;

import org.sos.pillsoo.mykit.entity.Cabinet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CabinetRepository extends JpaRepository<Cabinet, Integer> {
    List<Cabinet> findByUser_UserSeq(int userSeq);

    Optional<Cabinet> findByUser_UserSeqAndSupplement_SupplementSeq(int userSeq, int supplementSeq);

    void deleteByUser_UserSeqAndSupplement_SupplementSeq(int userSeq, int supplementSeq);
}

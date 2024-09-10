package org.sos.pillsoo.mykit.service;

import org.sos.pillsoo.mykit.dto.CabinetDto;
import org.sos.pillsoo.mykit.entity.Cabinet;
import org.sos.pillsoo.mykit.repository.CabinetRepository;
import org.sos.pillsoo.supplement.entity.Supplement;
import your.user.package.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CabinetService {

    @Autowired
    private CabinetRepository cabinetRepository;

    // 복용 중인 영양제 목록 조회
    public List<CabinetDto> getCabinetByUserSeq(int userSeq) {
        List<Cabinet> cabinets = cabinetRepository.findByUser_UserSeq(userSeq);
        return cabinets.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // 복용 중인 영양제 추가
    public void addSupplementToCabinet(int userSeq, int supplementSeq) {
        Cabinet cabinet = new Cabinet();
        cabinet.setUser(new User(userSeq));
        cabinet.setSupplement(new Supplement(supplementSeq));
        cabinetRepository.save(cabinet);
    }

    // 복용 중인 영양제 제거
    public void removeSupplementFromCabinet(int userSeq, int supplementSeq) {
        cabinetRepository.deleteByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq);
    }

    private CabinetDto convertToDto(Cabinet cabinet) {
        CabinetDto dto = new CabinetDto();
        dto.setSupplementSeq(cabinet.getSupplement().getSupplementSeq());
        dto.setPillName(cabinet.getSupplement().getPillName());
        dto.setFunctionality(cabinet.getSupplement().getFunctionality());
        return dto;
    }
}

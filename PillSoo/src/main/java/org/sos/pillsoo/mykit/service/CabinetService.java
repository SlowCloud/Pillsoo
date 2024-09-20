package org.sos.pillsoo.mykit.service;

import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.auth.repository.UserRepository;
import org.sos.pillsoo.mykit.dto.CabinetDto;
import org.sos.pillsoo.mykit.entity.Cabinet;
import org.sos.pillsoo.mykit.repository.CabinetRepository;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CabinetService {

    @Autowired
    private CabinetRepository cabinetRepository;

    @Autowired
    private UserRepository userRepository;

    // 복용 중인 영양제 목록 조회
    public List<CabinetDto> getCabinetByUserSeq(int userSeq) {
        List<Cabinet> cabinets = cabinetRepository.findByUser_UserSeq(userSeq);
        return cabinets.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // 복용 중인 영양제 추가
    public void addSupplementToCabinet(int userSeq, int supplementSeq) {
        // 디버그 로그 추가
        System.out.println("Received userSeq: " + userSeq + ", supplementSeq: " + supplementSeq);

        // User 객체를 데이터베이스에서 조회
        User user = userRepository.findById(userSeq)
                .orElseThrow(() -> {
                    System.out.println("User with userSeq " + userSeq + " not found.");
                    return new IllegalArgumentException("유효하지 않은 사용자입니다.");
                });

        // Supplement 객체 생성
        Supplement supplement = new Supplement(supplementSeq);

        // Cabinet 객체 생성
        Cabinet cabinet = new Cabinet();
        cabinet.setUser(user);
        cabinet.setSupplement(supplement);

        // 데이터베이스에 저장
        cabinetRepository.save(cabinet);
    }

    // 복용 중인 영양제 제거
    @Transactional
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

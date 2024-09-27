package org.sos.pillsoo.mykit.service;

import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.auth.repository.UserRepository;
import org.sos.pillsoo.mykit.dto.MyKitDto;
import org.sos.pillsoo.mykit.entity.MyKit;
import org.sos.pillsoo.mykit.repository.MyKitRepository;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MyKitService {

    @Autowired
    private MyKitRepository myKitRepository;

    @Autowired
    private UserRepository userRepository;

    // 복용 중인 영양제 목록 조회
    public List<MyKitDto> getMykitByUserSeq(int userSeq) {
        List<MyKit> myKits = myKitRepository.findByUser_UserSeq(userSeq);
        return myKits.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // 복용 중인 영양제 추가
    public void addSupplementToMyKit(int userSeq, int supplementSeq) {
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

        // MyKit 객체 생성
        MyKit myKit = new MyKit();
        myKit.setUser(user);
        myKit.setSupplement(supplement);

        // 데이터베이스에 저장
        myKitRepository.save(myKit);
    }

    // 복용 중인 영양제 제거
    @Transactional
    public void removeSupplementFromMyKit(int userSeq, int supplementSeq) {
        myKitRepository.deleteByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq);
    }

    private MyKitDto convertToDto(MyKit myKit) {
        MyKitDto dto = new MyKitDto();
        dto.setSupplementSeq(myKit.getSupplement().getSupplementSeq());
        dto.setPillName(myKit.getSupplement().getPillName());
        dto.setFunctionality(myKit.getSupplement().getFunctionality());
        dto.setImageUrl(myKit.getSupplement().getImageUrl());
        return dto;
    }
}

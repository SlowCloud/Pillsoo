package org.sos.pillsoo.cabinet.controller;

import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.cabinet.dto.CabinetDto;
import org.sos.pillsoo.cabinet.service.CabinetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cabinet")
public class CabinetController {

    @Autowired
    private CabinetService cabinetService;

    // JWT 토큰에서 userSeq 추출하는 메서드
    private int getUserSeqFromJWT() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserSeq();
    }

    // 복용 중인 영양제 목록 조회
    @GetMapping
    public List<CabinetDto> getCabinet() {
        int userSeq = getUserSeqFromJWT();  // JWT에서 userSeq 추출

        // 디버그 로그
        System.out.println("Extracted userSeq from JWT: " + userSeq);

        return cabinetService.getCabinetByUserSeq(userSeq);
    }

    // 복용 중인 영양제 추가
    @PostMapping
    public void addSupplement(@RequestBody CabinetDto cabinetDto) {
        int userSeq = getUserSeqFromJWT();  // JWT에서 userSeq 추출

        // 디버그 로그
        System.out.println("Extracted userSeq from JWT: " + userSeq);

        cabinetService.addSupplementToCabinet(userSeq, cabinetDto.getSupplementSeq());
    }

    // 복용 중인 영양제 제거
    @DeleteMapping
    public void removeSupplement(@RequestParam int supplementSeq) {
        int userSeq = getUserSeqFromJWT();  // JWT에서 userSeq 추출

        // 디버그 로그
        System.out.println("Extracted userSeq from JWT: " + userSeq);

        cabinetService.removeSupplementFromCabinet(userSeq, supplementSeq);
    }
}

package org.sos.pillsoo.mykit.controller;

import org.sos.pillsoo.mykit.dto.CabinetDto;
import org.sos.pillsoo.mykit.service.CabinetService;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/my-kit")
public class CabinetController {

    @Autowired
    private CabinetService cabinetService;

    // 복용 중인 영양제 목록 조회
    @GetMapping
    public List<CabinetDto> getCabinet() {
        // JWT 토큰에서 userSeq를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        int userSeq = userDetails.getUserSeq(); // JWT 토큰에서 추출한 userSeq

        return cabinetService.getCabinetByUserSeq(userSeq);
    }

    // 복용 중인 영양제 추가
    @PostMapping
    public void addSupplement(@RequestBody CabinetDto cabinetDto) {
        // JWT 토큰에서 userSeq를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        int userSeq = userDetails.getUserSeq(); // JWT 토큰에서 추출한 userSeq

        cabinetService.addSupplementToCabinet(userSeq, cabinetDto.getSupplementSeq());
    }

    // 복용 중인 영양제 제거
    @DeleteMapping
    public void removeSupplement(@RequestParam int supplementSeq) {
        // JWT 토큰에서 userSeq를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        int userSeq = userDetails.getUserSeq(); // JWT 토큰에서 추출한 userSeq

        cabinetService.removeSupplementFromCabinet(userSeq, supplementSeq);
    }
}

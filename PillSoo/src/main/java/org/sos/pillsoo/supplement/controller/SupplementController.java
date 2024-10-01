package org.sos.pillsoo.supplement.controller;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.supplement.dto.SupplementDto;
import org.sos.pillsoo.supplement.entity.EffectCategories;
import org.sos.pillsoo.supplement.service.SupplementService;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/supplement")
public class SupplementController {

    private final SupplementService supplementService;

    // 영양제 상세 정보 조회 (userSeq를 JWT에서 추출)
    @GetMapping("/{supplementSeq}")
    public SupplementDto getSupplement(@PathVariable int supplementSeq) {
        // JWT 토큰에서 userSeq를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();  // 사용자 정보에서 userSeq를 가져옴
        int userSeq = userDetails.getUserSeq();

        supplementService.recordClickCount(supplementSeq, userSeq);

        // 서비스에 userSeq와 supplementSeq 전달
        return supplementService.getSupplementById(supplementSeq, userSeq);
    }

    // 카테고리별 영양제 조회 (effect_name에 따른 조회 + 페이지네이션 추가)
    @GetMapping("/effect/{effect_name}")
    public Page<EffectCategories> getSupplementsByEffectName(
            @PathVariable String effect_name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return supplementService.getSupplementsByEffectName(effect_name, page, size);
    }

    // 영양제 검색 (페이지네이션 추가)
    @GetMapping("/search")
    public Page<SupplementDto> searchSupplements(
            @RequestParam String searchtext,
            @RequestParam(required = false, defaultValue = "") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return supplementService.searchSupplements(searchtext, type, page, size);
    }
}
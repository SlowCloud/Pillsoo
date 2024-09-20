package org.sos.pillsoo.supplement.controller;

import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.supplement.dto.SupplementDto;
import org.sos.pillsoo.supplement.service.SupplementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/supplement")
public class SupplementController {

    @Autowired
    private SupplementService supplementService;

    // 영양제 상세 정보 조회 (userSeq를 JWT에서 추출)
    @GetMapping("/{supplementSeq}")
    public SupplementDto getSupplement(@PathVariable int supplementSeq) {
        // JWT 토큰에서 userSeq를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();  // 사용자 정보에서 userSeq를 가져옴
        int userSeq = userDetails.getUserSeq();

        // 서비스에 userSeq와 supplementSeq 전달
        return supplementService.getSupplementById(supplementSeq, userSeq);
    }

    // 영양제 검색 (JWT를 사용하지 않고 그대로 유지)
    @GetMapping("/search")
    public List<SupplementDto> searchSupplements(@RequestParam String searchtext, @RequestParam(required = false) String type) {
        return supplementService.searchSupplements(searchtext, type);
    }
}
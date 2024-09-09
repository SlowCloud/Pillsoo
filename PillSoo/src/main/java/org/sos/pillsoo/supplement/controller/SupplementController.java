package org.sos.pillsoo.supplement.controller;

import org.sos.pillsoo.supplement.dto.SupplementDto;
import org.sos.pillsoo.supplement.service.SupplementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/supplement")
public class SupplementController {

    @Autowired
    private SupplementService supplementService;

    // 영양제 상세 정보 조회
    @GetMapping("/{supplementSeq}")
    public SupplementDto getSupplement(@PathVariable int supplementSeq, @RequestParam int userSeq) {
        return supplementService.getSupplementById(supplementSeq, userSeq);
    }

    // 영양제 검색
    @GetMapping("/search")
    public List<SupplementDto> searchSupplements(@RequestParam String searchtext, @RequestParam(required = false) String type) {
        return supplementService.searchSupplements(searchtext, type);
    }
}

package org.sos.pillsoo.cabinet.controller;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.cabinet.dto.CabinetDto;
import org.sos.pillsoo.cabinet.service.CabinetService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/cabinet")
public class CabinetController {

    private final CabinetService cabinetService;

    @GetMapping
    public List<CabinetDto> getCabinet(@AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        return cabinetService.getCabinetByUserSeq(userSeq);
    }

    @PostMapping
    public void addSupplement(@RequestBody CabinetDto cabinetDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        cabinetService.addSupplementToCabinet(userSeq, cabinetDto.getSupplementSeq());
    }

    @DeleteMapping
    public void removeSupplement(@RequestParam int supplementSeq, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        cabinetService.removeSupplementFromCabinet(userSeq, supplementSeq);
    }
}

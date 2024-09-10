package org.sos.pillsoo.mykit.controller;

import org.sos.pillsoo.mykit.dto.CabinetDto;
import org.sos.pillsoo.mykit.service.CabinetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/my-kit")
public class CabinetController {

    @Autowired
    private CabinetService cabinetService;

    // 복용 중인 영양제 목록 조회
    @GetMapping
    public List<CabinetDto> getCabinet(@RequestParam int userSeq) {
        return cabinetService.getCabinetByUserSeq(userSeq);
    }

    // 복용 중인 영양제 추가
    @PostMapping
    public void addSupplement(@RequestParam int userSeq, @RequestBody CabinetDto cabinetDto) {
        cabinetService.addSupplementToCabinet(userSeq, cabinetDto.getSupplementSeq());
    }

    // 복용 중인 영양제 제거
    @DeleteMapping
    public void removeSupplement(@RequestParam int userSeq, @RequestParam int supplementSeq) {
        cabinetService.removeSupplementFromCabinet(userSeq, supplementSeq);
    }
}

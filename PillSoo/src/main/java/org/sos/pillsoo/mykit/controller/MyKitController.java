package org.sos.pillsoo.mykit.controller;

import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.mykit.dto.MyKitDto;
import org.sos.pillsoo.mykit.service.MyKitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/my-kit")
public class MyKitController {

    @Autowired
    private MyKitService myKitService;

    // JWT 토큰에서 userSeq 추출하는 메서드
    private int getUserSeqFromJWT() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getUserSeq();
    }

    // 복용 중인 영양제 목록 조회
    @GetMapping
    public List<MyKitDto> getMyKit() {
        int userSeq = getUserSeqFromJWT();  // JWT에서 userSeq 추출

        // 디버그 로그
        System.out.println("Extracted userSeq from JWT: " + userSeq);

        return myKitService.getMykitByUserSeq(userSeq);
    }

    // 복용 중인 영양제 추가
    @PostMapping
    public void addSupplement(@RequestBody MyKitDto myKitDto) {
        int userSeq = getUserSeqFromJWT();  // JWT에서 userSeq 추출

        // 디버그 로그
        System.out.println("Extracted userSeq from JWT: " + userSeq);

        myKitService.addSupplementToMyKit(userSeq, myKitDto.getSupplementSeq());
    }

    // 복용 중인 영양제 제거
    @DeleteMapping
    public void removeSupplement(@RequestParam int supplementSeq) {
        int userSeq = getUserSeqFromJWT();  // JWT에서 userSeq 추출

        // 디버그 로그
        System.out.println("Extracted userSeq from JWT: " + userSeq);

        myKitService.removeSupplementFromMyKit(userSeq, supplementSeq);
    }
}

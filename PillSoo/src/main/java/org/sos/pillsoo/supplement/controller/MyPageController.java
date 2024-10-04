package org.sos.pillsoo.supplement.controller;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.service.MyPageService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/reviews")
public class MyPageController {

    private final MyPageService myPageService;

    // 내 리뷰 조회 (마이페이지)
    @GetMapping
    public List<ReviewDto> getMyReviews(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return myPageService.getMyReviews(userDetails.getUserSeq());
    }
}

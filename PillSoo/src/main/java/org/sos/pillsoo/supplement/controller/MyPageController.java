package org.sos.pillsoo.supplement.controller;

import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.service.MyPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class MyPageController {

    @Autowired
    private MyPageService myPageService;

    // 내 리뷰 조회 (마이페이지)
    @GetMapping
    public List<ReviewDto> getMyReviews(@RequestParam int userSeq) {
        return myPageService.getMyReviews(userSeq);
    }
}

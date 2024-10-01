package org.sos.pillsoo.supplement.controller;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/supplement/{supplementSeq}/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    // 리뷰 조회
    @GetMapping
    public List<ReviewDto> getReviews(@PathVariable int supplementSeq) {
        return reviewService.getReviews(supplementSeq);
    }

    // 리뷰 작성 (userSeq를 JWT에서 가져옴)
    @PostMapping
    public ReviewDto addReview(@PathVariable int supplementSeq, @RequestBody ReviewDto reviewDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        return reviewService.addReview(supplementSeq, userSeq, reviewDto);
    }

    // 리뷰 삭제 (userSeq를 JWT에서 가져옴)
    @DeleteMapping
    public void deleteReview(@PathVariable int supplementSeq, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        reviewService.deleteReview(supplementSeq, userSeq);
    }

    // 리뷰 수정 (userSeq를 JWT에서 가져옴, content만 수정)
    @PatchMapping
    public ReviewDto updateReviewContent(@PathVariable int supplementSeq, @RequestBody ReviewDto reviewDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        return reviewService.updateReviewContent(supplementSeq, userSeq, reviewDto);
    }
}

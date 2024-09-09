package org.sos.pillsoo.supplement.controller;

import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/supplement/{supplementSeq}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // 리뷰 조회
    @GetMapping
    public List<ReviewDto> getReviews(@PathVariable int supplementSeq) {
        return reviewService.getReviews(supplementSeq);
    }

    // 리뷰 작성
    @PostMapping
    public ReviewDto addReview(@PathVariable int supplementSeq, @RequestBody ReviewDto reviewDto) {
        return reviewService.addReview(supplementSeq, reviewDto);
    }

    // 리뷰 삭제
    @DeleteMapping
    public void deleteReview(@PathVariable int supplementSeq, @RequestParam int userSeq) {
        reviewService.deleteReview(supplementSeq, userSeq);
    }

    // 리뷰 수정 (PATCH 사용 - content만 수정)
    @PatchMapping
    public ReviewDto updateReviewContent(@PathVariable int supplementSeq, @RequestBody ReviewDto reviewDto) {
        return reviewService.updateReviewContent(supplementSeq, reviewDto);
    }
}

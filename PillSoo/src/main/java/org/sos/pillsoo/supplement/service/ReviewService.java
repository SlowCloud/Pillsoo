package org.sos.pillsoo.supplement.service;

import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.entity.Review;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.sos.pillsoo.supplement.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<ReviewDto> getReviews(int supplementSeq) {
        List<Review> reviews = reviewRepository.findBySupplement_SupplementSeq(supplementSeq);
        return reviews.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public ReviewDto addReview(int supplementSeq, ReviewDto reviewDto) {
        Review review = new Review();
        review.setSupplement(new Supplement(supplementSeq));
        review.setUserSeq(reviewDto.getUserSeq());
        review.setContent(reviewDto.getContent());
        reviewRepository.save(review);
        return convertToDto(review);
    }

    public void deleteReview(int supplementSeq, int userSeq) {
        reviewRepository.deleteBySupplement_SupplementSeqAndUserSeq(supplementSeq, userSeq);
    }

    // PATCH: 리뷰 내용 수정
    public ReviewDto updateReviewContent(int supplementSeq, ReviewDto reviewDto) {
        Review review = reviewRepository.findById(reviewDto.getReviewSeq()).orElseThrow();
        review.setContent(reviewDto.getContent());  // content만 수정
        reviewRepository.save(review);
        return convertToDto(review);
    }

    private ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setReviewSeq(review.getReviewSeq());
        dto.setUserSeq(review.getUserSeq());
        dto.setContent(review.getContent());
        return dto;
    }
}

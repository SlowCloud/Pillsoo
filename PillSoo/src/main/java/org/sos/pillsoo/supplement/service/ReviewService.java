package org.sos.pillsoo.supplement.service;

import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.entity.Review;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.sos.pillsoo.supplement.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // 리뷰 목록 조회
    public List<ReviewDto> getReviews(int supplementSeq) {
        List<Review> reviews = reviewRepository.findBySupplement_SupplementSeq(supplementSeq);
        return reviews.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // 리뷰 작성 (userSeq는 JWT에서 받음)
    public ReviewDto addReview(int supplementSeq, int userSeq, ReviewDto reviewDto) {
        Review review = new Review();
        review.setSupplement(new Supplement(supplementSeq));
        review.setUserSeq(userSeq);  // JWT에서 받은 userSeq 사용
        review.setContent(reviewDto.getContent());

        // createdAt은 @PrePersist로 자동 설정됨
        reviewRepository.save(review);
        return convertToDto(review);
    }

    // 리뷰 삭제
    @Transactional
    public void deleteReview(int supplementSeq, int userSeq) {
        reviewRepository.deleteBySupplement_SupplementSeqAndUserSeq(supplementSeq, userSeq);
    }

    // 리뷰 수정 (content만 수정)
    public ReviewDto updateReviewContent(int supplementSeq, int userSeq, ReviewDto reviewDto) {
        Review review = reviewRepository.findById(reviewDto.getReviewSeq()).orElseThrow();

        // 수정하려는 리뷰가 해당 유저가 작성한 것인지 확인
        if (review.getUserSeq() != userSeq) {
            throw new IllegalArgumentException("유저는 자신의 리뷰만 수정할 수 있습니다.");
        }

        review.setContent(reviewDto.getContent());  // content만 수정
        reviewRepository.save(review);
        return convertToDto(review);
    }

    // Review -> ReviewDto로 변환하는 메서드
    private ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setReviewSeq(review.getReviewSeq());
        dto.setUserSeq(review.getUserSeq());
        dto.setSupplementSeq(review.getSupplement().getSupplementSeq());
        dto.setUserName("User"); // 실제 사용자 이름을 넣는 로직이 필요하다면 수정
        dto.setContent(review.getContent());
        dto.setCreatedAt(review.getCreatedAt());  // Timestamp로 저장
        return dto;
    }
}

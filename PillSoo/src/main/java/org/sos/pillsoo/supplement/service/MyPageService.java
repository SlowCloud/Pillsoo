package org.sos.pillsoo.supplement.service;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.entity.Review;
import org.sos.pillsoo.supplement.mapper.ReviewMapper;
import org.sos.pillsoo.supplement.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MyPageService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    // 사용자의 리뷰 조회
    public List<ReviewDto> getMyReviews(int userSeq) {
        List<Review> reviews = reviewRepository.findByUserSeq(userSeq);
        return reviews.stream().map(reviewMapper::toReviewDto).collect(Collectors.toList());
    }

    // Review 엔티티를 ReviewDto로 변환
    @Deprecated
    private ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setReviewSeq(review.getReviewSeq());

        // Review 엔티티에서 Supplement 엔티티를 통해 supplementSeq 가져오기
        dto.setSupplementSeq(review.getSupplement().getSupplementSeq());

        dto.setUserSeq(review.getUserSeq());
        dto.setContent(review.getContent());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }
}

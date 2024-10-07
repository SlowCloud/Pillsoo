package org.sos.pillsoo.supplement.service;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.auth.repository.UserRepository;
import org.sos.pillsoo.exception.PillSooException;
import org.sos.pillsoo.exception.errorCode.UserErrorCode;
import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.entity.Review;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.sos.pillsoo.supplement.mapper.ReviewMapper;
import org.sos.pillsoo.supplement.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository; // 추가: User 정보를 조회하기 위한 UserRepository 주입
    private final ReviewMapper reviewMapper;

    // 리뷰 목록 조회
    public List<ReviewDto> getReviews(int supplementSeq) {
        List<Review> reviews = reviewRepository.findBySupplement_SupplementSeq(supplementSeq);
        return reviews.stream().map(reviewMapper::toReviewDto).collect(Collectors.toList());
    }

    // 리뷰 작성 (userSeq는 JWT에서 받음)
    public ReviewDto addReview(int supplementSeq, int userSeq, ReviewDto reviewDto) {
        // userSeq로 User 정보를 조회
        User user = userRepository.findByUserSeq(userSeq);
        if (user == null) {
            throw new PillSooException(UserErrorCode.USER_NOT_FOUND);
        }

        // User에서 nickname 가져오기
        String nickname = user.getNickname();  // User 객체에서 닉네임을 가져옴
        Review review = new Review();
        review.setSupplement(new Supplement(supplementSeq));
        review.setUserSeq(userSeq);  // JWT에서 받은 userSeq 사용
        review.setNickName(nickname);
        review.setContent(reviewDto.getContent());

        // createdAt은 @PrePersist로 자동 설정됨
        reviewRepository.save(review);
        return reviewMapper.toReviewDto(review);
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
            throw new PillSooException(UserErrorCode.NOT_CURRENT_USER);
        }

        review.setContent(reviewDto.getContent());  // content만 수정
        reviewRepository.save(review);
        return reviewMapper.toReviewDto(review);
    }

}

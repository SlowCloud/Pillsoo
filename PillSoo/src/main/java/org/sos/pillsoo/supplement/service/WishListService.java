package org.sos.pillsoo.supplement.service;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.auth.repository.UserRepository;
import org.sos.pillsoo.supplement.dto.WishListDto;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.sos.pillsoo.supplement.entity.WishList;
import org.sos.pillsoo.supplement.repository.WishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class WishListService {

    private final WishListRepository wishListRepository;
    private final UserRepository userRepository;

    // 유저 시퀀스로 위시리스트 조회
    public List<WishListDto> getWishListByUserSeq(int userSeq) {
        List<WishList> wishLists = wishListRepository.findByUser_UserSeq(userSeq);
        return wishLists.stream()
                .map(wishList -> {
                    WishListDto dto = new WishListDto();
                    dto.setUserSeq(userSeq);
                    dto.setSupplementSeq(wishList.getSupplement().getSupplementSeq());
                    dto.setPillName(wishList.getSupplement().getPillName());
                    dto.setFunctionality(wishList.getSupplement().getFunctionality());
                    dto.setImageUrl(wishList.getSupplement().getImageUrl());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 위시리스트에 영양제 추가
    public void addToWishList(int userSeq, int supplementSeq) {
        // User 객체를 데이터베이스에서 조회
        User user = userRepository.findById(userSeq)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 사용자입니다."));

        Supplement supplement = new Supplement(supplementSeq);

        WishList wishList = new WishList();
        wishList.setUser(user);  // 조회된 User 객체를 설정
        wishList.setSupplement(supplement);

        wishListRepository.save(wishList);
    }

    // 위시리스트에서 영양제 제거
    @Transactional
    public void removeFromWishList(int userSeq, int supplementSeq) {
        wishListRepository.deleteByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq);
    }
}

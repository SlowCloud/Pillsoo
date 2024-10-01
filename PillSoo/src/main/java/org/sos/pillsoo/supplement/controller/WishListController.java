package org.sos.pillsoo.supplement.controller;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.supplement.dto.WishListDto;
import org.sos.pillsoo.supplement.service.WishListService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/wishlist")
public class WishListController {

    private final WishListService wishListService;

    // JWT에서 userSeq 추출하는 메서드
    private int getUserSeqFromJWT() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        int userSeq = userDetails.getUserSeq();
        System.out.println("Extracted userSeq from JWT: " + userSeq); // 디버깅 로그 추가
        return userSeq;
    }


    // 위시리스트 조회 (JWT에서 userSeq 추출)
    @GetMapping
    public List<WishListDto> getWishList() {
        int userSeq = getUserSeqFromJWT();  // JWT에서 userSeq 추출
        return wishListService.getWishListByUserSeq(userSeq);
    }

    // 위시리스트 추가 (JWT에서 userSeq 추출)
    @PostMapping
    public void addToWishList(@RequestBody WishListDto wishListDto) {
        int userSeq = getUserSeqFromJWT();  // JWT에서 userSeq 추출
        wishListService.addToWishList(userSeq, wishListDto.getSupplementSeq());
    }

    // 위시리스트 삭제 (JWT에서 userSeq 추출)
    @DeleteMapping
    public void removeFromWishList(@RequestParam int supplementSeq) {
        int userSeq = getUserSeqFromJWT();  // JWT에서 userSeq 추출
        wishListService.removeFromWishList(userSeq, supplementSeq);
    }
}

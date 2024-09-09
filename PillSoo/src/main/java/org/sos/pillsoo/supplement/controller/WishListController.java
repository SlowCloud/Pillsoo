package org.sos.pillsoo.supplement.controller;

import org.sos.pillsoo.supplement.dto.WishListDto;
import org.sos.pillsoo.supplement.service.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishListController {

    @Autowired
    private WishListService wishListService;

    // 위시리스트 조회
    @GetMapping
    public List<WishListDto> getWishList(@RequestParam int userSeq) {
        return wishListService.getWishListByUserSeq(userSeq);
    }

    // 위시리스트 추가
    @PostMapping
    public void addToWishList(@RequestBody WishListDto wishListDto) {
        wishListService.addToWishList(wishListDto.getUserSeq(), wishListDto.getSupplementSeq());
    }

    // 위시리스트 삭제
    @DeleteMapping
    public void removeFromWishList(@RequestParam int userSeq, @RequestParam int supplementSeq) {
        wishListService.removeFromWishList(userSeq, supplementSeq);
    }
}

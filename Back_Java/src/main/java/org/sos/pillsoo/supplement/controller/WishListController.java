package org.sos.pillsoo.supplement.controller;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.supplement.dto.WishListDto;
import org.sos.pillsoo.supplement.service.WishListService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/wishlist")
public class WishListController {

    private final WishListService wishListService;

    @GetMapping
    public List<WishListDto> getWishList(@AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        return wishListService.getWishListByUserSeq(userSeq);
    }

    @PostMapping
    public void addToWishList(@RequestBody WishListDto wishListDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        wishListService.addToWishList(userSeq, wishListDto.getSupplementSeq());
    }

    @DeleteMapping
    public void removeFromWishList(@RequestParam int supplementSeq, @AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        wishListService.removeFromWishList(userSeq, supplementSeq);
    }
}

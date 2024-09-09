package org.sos.pillsoo.supplement.service;

import org.sos.pillsoo.supplement.dto.WishListDto;
import org.sos.pillsoo.supplement.entity.WishList;
import org.sos.pillsoo.supplement.repository.WishListRepository;
import org.sos.pillsoo.supplement.entity.Supplement;
import your.user.package.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishListService {

    @Autowired
    private WishListRepository wishListRepository;

    public List<WishListDto> getWishListByUserSeq(int userSeq) {
        List<WishList> wishLists = wishListRepository.findByUser_UserSeq(userSeq);
        return wishLists.stream()
                .map(wishList -> {
                    WishListDto dto = new WishListDto();
                    dto.setSupplementSeq(wishList.getSupplement().getSupplementSeq());
                    dto.setPillName(wishList.getSupplement().getPillName());
                    dto.setFunctionality(wishList.getSupplement().getFunctionality());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public void addToWishList(int userSeq, int supplementSeq) {
        WishList wishList = new WishList();
        wishList.setUser(new User(userSeq));  // 유저와 연결 (User는 다른 패키지에 존재)
        wishList.setSupplement(new Supplement(supplementSeq));  // 영양제와 연결
        wishListRepository.save(wishList);
    }

    public void removeFromWishList(int userSeq, int supplementSeq) {
        wishListRepository.deleteByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq);
    }
}

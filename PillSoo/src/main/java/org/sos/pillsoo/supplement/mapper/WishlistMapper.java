package org.sos.pillsoo.supplement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.sos.pillsoo.supplement.dto.WishListDto;
import org.sos.pillsoo.supplement.entity.WishList;

@Mapper(componentModel = "spring")
public interface WishlistMapper {
    @Mapping(target=".", source = "wishList.supplement")
    @Mapping(target = "userSeq", source = "wishList.user.userSeq")
    WishListDto toWishlistDto(WishList wishList);
}

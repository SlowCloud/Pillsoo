package org.sos.pillsoo.supplement.mapper;

import org.hibernate.sql.ast.tree.from.TableAliasResolver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.supplement.dto.ReviewDto;
import org.sos.pillsoo.supplement.entity.Review;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(target = "supplementSeq", source = "review.supplement.supplementSeq")
    @Mapping(target = "userName", constant = "Unknown user")
    ReviewDto toReviewDto(Review review);
    @Mapping(target = "supplementSeq", source = "review.supplement.supplementSeq")
    @Mapping(target = "userName", defaultValue = "Unknown user")
    ReviewDto toReviewDto(Review review, String userName);
}

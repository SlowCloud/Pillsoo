package org.sos.pillsoo.supplement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import org.sos.pillsoo.elasticsearch.entity.ElasticSupplement;
import org.sos.pillsoo.supplement.dto.SupplementDto;
import org.sos.pillsoo.supplement.entity.Supplement;

@Mapper(componentModel = "spring")
public interface SupplementMapper {
    SupplementDto toSupplementDto(Supplement supplement, boolean inWishlist, boolean inMykit);
    @Mappings({
            @Mapping(target = "inWishlist", constant = "false"),
            @Mapping(target = "inMykit", constant = "false")
    })
    SupplementDto toSupplementDto(Supplement supplement);
    @Mappings({
            @Mapping(target = "inWishlist", constant = "false"),
            @Mapping(target = "inMykit", constant = "false")
    })
    SupplementDto toSupplementDto(ElasticSupplement supplement);
}

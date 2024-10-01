package org.sos.pillsoo.supplement.mapper;

import org.mapstruct.Mapper;
import org.sos.pillsoo.elasticsearch.entity.ElasticSupplement;
import org.sos.pillsoo.supplement.dto.SupplementDto;
import org.sos.pillsoo.supplement.entity.Supplement;

@Mapper(componentModel = "spring")
public interface SupplementMapper {
    SupplementDto toSupplementDto(Supplement supplement, boolean inWishlist, boolean inMykit);
    SupplementDto toSupplementDto(Supplement supplement);
    SupplementDto toSupplementDto(ElasticSupplement supplement);
}

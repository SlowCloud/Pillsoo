package org.sos.pillsoo.supplement.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.sos.pillsoo.supplement.dto.SupplementDto;
import org.sos.pillsoo.supplement.entity.Supplement;

@Mapper(componentModel = "spring")
public interface SupplementMapper {
    SupplementDto toSupplementDto(Supplement supplement, boolean inWishlist, boolean inMykit);
    SupplementDto toSupplementDto(Supplement supplement);
}

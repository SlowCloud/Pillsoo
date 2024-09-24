package org.sos.pillsoo.supplement.service;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.mykit.repository.CabinetRepository;
import org.sos.pillsoo.supplement.dto.SupplementDto;
import org.sos.pillsoo.supplement.entity.EffectCategories;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.sos.pillsoo.supplement.mapper.SupplementMapper;
import org.sos.pillsoo.supplement.repository.EffectCategoriesRepository;
import org.sos.pillsoo.supplement.repository.SupplementRepository;
import org.sos.pillsoo.supplement.repository.WishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class SupplementService {

    private final SupplementRepository supplementRepository;
    private final EffectCategoriesRepository effectCategoriesRepository;
    private final WishListRepository wishListRepository;
    private final CabinetRepository cabinetRepository;
    private final SupplementMapper supplementMapper;

    public SupplementDto getSupplementById(int supplementSeq, int userSeq) {
        Supplement supplement = supplementRepository.findById(supplementSeq).orElseThrow();
        boolean isInWishlist = wishListRepository.existsByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq);
        boolean isInMykit = cabinetRepository.findByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq).isPresent();
        return supplementMapper.toSupplementDto(supplement, isInWishlist, isInMykit);
    }

    public List<EffectCategories> getSupplementsByEffectName(String effectName) {
        // effect_name에 해당하는 영양제 목록을 조회
        return effectCategoriesRepository.findByEffectName(effectName);
    }

    public List<SupplementDto> searchSupplements(String searchtext, String type) {
        List<Supplement> supplements = supplementRepository.findByPillNameContaining(searchtext);
        return supplements.stream().map(supplementMapper::toSupplementDto).collect(Collectors.toList());
    }

}

package org.sos.pillsoo.supplement.service;

import org.sos.pillsoo.mykit.repository.CabinetRepository;
import org.sos.pillsoo.supplement.dto.SupplementDto;
import org.sos.pillsoo.supplement.entity.EffectCategories;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.sos.pillsoo.supplement.repository.EffectCategoriesRepository;
import org.sos.pillsoo.supplement.repository.SupplementRepository;
import org.sos.pillsoo.supplement.repository.WishListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplementService {

    @Autowired
    private SupplementRepository supplementRepository;

    @Autowired
    private EffectCategoriesRepository effectCategoriesRepository;

    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private CabinetRepository cabinetRepository;

    public SupplementDto getSupplementById(int supplementSeq, int userSeq) {
        Supplement supplement = supplementRepository.findById(supplementSeq).orElseThrow();
        boolean isInWishlist = wishListRepository.existsByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq);
        boolean isInMykit = cabinetRepository.findByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq).isPresent();

        SupplementDto dto = new SupplementDto();
        dto.setSupplementSeq(supplement.getSupplementSeq());
        dto.setPillName(supplement.getPillName());
        dto.setExpirationDate(supplement.getExpirationDate().toString());
        dto.setAppearance(supplement.getAppearance());
        dto.setDoseAmount(supplement.getDoseAmount());
        dto.setStorageMethod(supplement.getStorageMethod());
        dto.setDoseGuide(supplement.getDoseGuide());
        dto.setFunctionality(supplement.getFunctionality());
        dto.setImageUrl(supplement.getImageUrl());
        dto.setInWishlist(isInWishlist);
        dto.setInMykit(isInMykit);

        return dto;
    }

    public Page<EffectCategories> getSupplementsByEffectName(String effectName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return effectCategoriesRepository.findByEffectName(effectName, pageable);
    }

    public Page<SupplementDto> searchSupplements(String searchtext, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Supplement> supplements = supplementRepository.findByPillNameContaining(searchtext, pageable);

        return supplements.map(this::convertToDto);
    }

    private SupplementDto convertToDto(Supplement supplement) {
        SupplementDto dto = new SupplementDto();
        dto.setSupplementSeq(supplement.getSupplementSeq());
        dto.setPillName(supplement.getPillName());
        dto.setExpirationDate(supplement.getExpirationDate().toString());
        dto.setAppearance(supplement.getAppearance());
        dto.setDoseAmount(supplement.getDoseAmount());
        dto.setStorageMethod(supplement.getStorageMethod());
        dto.setDoseGuide(supplement.getDoseGuide());
        dto.setFunctionality(supplement.getFunctionality());
        dto.setImageUrl(supplement.getImageUrl());
        return dto;
    }
}

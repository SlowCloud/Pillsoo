package org.sos.pillsoo.supplement.service;

import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.auth.repository.UserRepository;
import org.sos.pillsoo.cabinet.repository.CabinetRepository;
import org.sos.pillsoo.elasticsearch.entity.ElasticSupplement;
import org.sos.pillsoo.elasticsearch.repository.ElasticSupplementRepository;
import org.sos.pillsoo.supplement.dto.SupplementDto;
import org.sos.pillsoo.supplement.entity.ClickCount;
import org.sos.pillsoo.supplement.entity.EffectCategories;
import org.sos.pillsoo.supplement.entity.Supplement;
import org.sos.pillsoo.supplement.mapper.SupplementMapper;
import org.sos.pillsoo.supplement.repository.ClickCountRepository;
import org.sos.pillsoo.supplement.repository.EffectCategoriesRepository;
import org.sos.pillsoo.supplement.repository.SupplementRepository;
import org.sos.pillsoo.supplement.repository.WishListRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SupplementService {

    private final SupplementRepository supplementRepository;
    private final ElasticSupplementRepository elasticSupplementRepository;
    private final EffectCategoriesRepository effectCategoriesRepository;
    private final WishListRepository wishListRepository;
    private final CabinetRepository cabinetRepository;
    private final ClickCountRepository clickCountRepository;
    private final UserRepository userRepository;
    private final SupplementMapper supplementMapper;

    public SupplementDto getSupplementById(int supplementSeq, int userSeq) {
        Supplement supplement = supplementRepository.findById(supplementSeq).orElseThrow();
        boolean isInWishlist = wishListRepository.existsByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq);
        boolean isInMykit = cabinetRepository.findByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq).isPresent();
        return supplementMapper.toSupplementDto(supplement, isInWishlist, isInMykit);
    }

    public Page<EffectCategories> getSupplementsByEffectName(String effectName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return effectCategoriesRepository.findByEffectName(effectName, pageable);
    }

    public Page<SupplementDto> searchSupplements(String searchtext, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ElasticSupplement> supplements = elasticSupplementRepository.searchWithText(searchtext, pageable);
        return supplements.map(supplementMapper::toSupplementDto);
    }

    public void recordClickCount(int supplementSeq, int userSeq) {
        ClickCount clickCount = new ClickCount();
        User user = userRepository.getReferenceById(userSeq);
        Supplement supplement = supplementRepository.getReferenceById(supplementSeq);
        clickCount.setUser(user);
        clickCount.setSupplement(supplement);
        clickCountRepository.save(clickCount);
    }
}

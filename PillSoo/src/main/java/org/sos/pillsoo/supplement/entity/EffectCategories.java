package org.sos.pillsoo.supplement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor  // 기본 생성자
@Table(name = "Effect_Categories")  // DB 테이블 이름 (대문자)
public class EffectCategories {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "effect_seq")  // 테이블의 효과 시퀀스
    private int effectSeq;

    @Column(name = "supplement_seq")  // 영양제 시퀀스
    private int supplementSeq;

    @Column(name = "effect_name")  // 효과 이름
    private String effectName;

    // 커스텀 생성자
    public EffectCategories(int effectSeq, int supplementSeq, String effectName) {
        this.effectSeq = effectSeq;
        this.supplementSeq = supplementSeq;
        this.effectName = effectName;
    }
}

package org.sos.pillsoo.supplement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor  // 기본 생성자
@Table(name = "Supplement")  // DB 테이블 이름 (대문자)
public class Supplement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplementSeq")
    private int supplementSeq;

    @Column(name = "PILL_NAME")  // 대문자 컬럼 이름
    private String pillName;

    @Column(name = "EXPIRATION_DATE")  // 대문자 컬럼 이름
    private String expirationDate;

    @Column(name = "appearance", columnDefinition = "TEXT")
    private String appearance;

    @Column(name = "DOSE_AMOUNT", columnDefinition = "TEXT")  // 대문자 컬럼 이름
    private String doseAmount;

    @Column(name = "STORAGE_METHOD", columnDefinition = "TEXT")  // 대문자 컬럼 이름
    private String storageMethod;

    @Column(name = "DOSE_GUIDE", columnDefinition = "TEXT")  // 대문자 컬럼 이름
    private String doseGuide;

    @Column(name = "functionality", columnDefinition = "TEXT")
    private String functionality;

    @Column(name = "IMAGE_URL")  // 대문자 컬럼 이름
    private String imageUrl;

    @OneToMany(mappedBy = "supplement")
    private List<WishList> wishLists;

    // 커스텀 생성자 추가
    public Supplement(int supplementSeq) {
        this.supplementSeq = supplementSeq;
    }
}

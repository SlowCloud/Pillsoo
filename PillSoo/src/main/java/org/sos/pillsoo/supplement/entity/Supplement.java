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
@Table(name = "Supplement")
public class Supplement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int supplementSeq;

    private String pillName;
    private Date expirationDate;
    private String appearance;
    private String doseAmount;
    private String storageMethod;
    private String doseGuide;
    private String functionality;
    private String imageUrl;

    @OneToMany(mappedBy = "supplement")
    private List<WishList> wishLists;

    // 커스텀 생성자 추가
    public Supplement(int supplementSeq) {
        this.supplementSeq = supplementSeq;
    }
}

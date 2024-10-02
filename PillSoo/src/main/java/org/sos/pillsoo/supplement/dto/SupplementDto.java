package org.sos.pillsoo.supplement.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SupplementDto {
    private int supplementSeq;
    private String pillName;
    private String expirationDate;
    private String appearance;
    private String doseAmount;
    private String storageMethod;
    private String doseGuide;
    private String functionality;
    private String imageUrl;
    private boolean inWishlist;  // isInWishlist 대신 inWishlist로 정의
    private boolean inMykit;     // Mykit에 있는지 여부 추가
}

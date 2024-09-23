package org.sos.pillsoo.supplement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
}

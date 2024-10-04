package org.sos.pillsoo.supplement.dto;

import lombok.Data;

@Data
public class WishListDto {
    private int userSeq;        // userSeq 필드 추가
    private int supplementSeq;
    private String pillName;
    private String functionality;
    private String imageUrl;
}

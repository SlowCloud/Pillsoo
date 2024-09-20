package org.sos.pillsoo.supplement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishListDto {
    private int userSeq;        // userSeq 필드 추가
    private int supplementSeq;
    private String pillName;
    private String functionality;
}

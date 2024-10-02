package org.sos.pillsoo.callFast.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RecommendResDto {
    private int supplementSeq;
    private String pill_name;
    private String functionality;
    private String image_url;
    private String dose_guide;
}
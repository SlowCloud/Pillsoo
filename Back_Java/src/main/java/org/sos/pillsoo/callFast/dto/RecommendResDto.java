package org.sos.pillsoo.callFast.dto;

import lombok.Data;

@Data
public class RecommendResDto {
    private int supplementSeq;
    private String pill_name;
    private String functionality;
    private String image_url;
    private String dose_guide;
    private boolean is_random;
}

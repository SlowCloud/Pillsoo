package org.sos.pillsoo.callFast.dto;

import lombok.Data;

@Data
public class TextBasedResDto {
    private int supplementSeq;
    private String pill_name;
    private String functionality;
    private String dose_guide;
    private String image_url;
}

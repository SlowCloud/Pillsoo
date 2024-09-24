package org.sos.pillsoo.callFast.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TextBasedResDto {
    private int supplementSeq;
    private String pill_name;
    private String functionality;
    private String dose_guide;
}

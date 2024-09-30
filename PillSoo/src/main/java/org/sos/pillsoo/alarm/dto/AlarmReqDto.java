package org.sos.pillsoo.alarm.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class AlarmReqDto {
    private int supplementSeq; // 영양제 seq
    private LocalTime time;
}

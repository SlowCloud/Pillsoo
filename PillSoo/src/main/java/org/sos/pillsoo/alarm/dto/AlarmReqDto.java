package org.sos.pillsoo.alarm.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalTime;

@Getter
@Setter
@ToString
public class AlarmReqDto {
    private int supplementSeq; // 영양제 seq
    private LocalTime time;
}

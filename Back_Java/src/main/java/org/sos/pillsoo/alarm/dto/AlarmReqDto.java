package org.sos.pillsoo.alarm.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class AlarmReqDto {
    private int supplementSeq; // 영양제 seq
    private LocalTime time;
}

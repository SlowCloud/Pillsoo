package org.sos.pillsoo.alarm.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class AlarmResDto {

    private long alarmSeq;
    private int userSeq;
    private int supplementSeq;
    private LocalTime time;
    private boolean isTurnOn = true;


}

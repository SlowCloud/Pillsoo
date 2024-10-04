package org.sos.pillsoo.alarm.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class GetAlarmsResDto {

    private long alarmSeq;
    private int userSeq;
    private int supplementSeq;
    private String supplementName;
    private LocalTime time;
    private boolean isTurnOn;

}

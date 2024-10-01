package org.sos.pillsoo.alarm.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalTime;

@Getter
@Setter
@ToString
public class GetAlarmsResDto {

    private long alarmSeq;
    private int userSeq;
    private int supplementSeq;
    private String supplementName;
    private LocalTime time;
    private boolean isTurnOn;

}

package org.sos.pillsoo.alarm.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AlarmDto {
    private long alarmSeq;
    private int supplementSeq;
    private String pillName;
    private Date alert;
    private boolean isTurnOn;
}

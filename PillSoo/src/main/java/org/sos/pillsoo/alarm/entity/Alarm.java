package org.sos.pillsoo.alarm.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import org.sos.pillsoo.cabinet.entity.Cabinet;


import java.time.LocalTime;


@Entity
@Getter
@Setter
@Table(name = "Alarm")
public class Alarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long alarmSeq;
    @ManyToOne
    @JoinColumn(name = "cabinetSeq")
    private Cabinet cabinet;
    private boolean isTurnOn = true;
    private LocalTime time;
}

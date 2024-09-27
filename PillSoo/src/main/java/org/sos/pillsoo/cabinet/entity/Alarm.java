package org.sos.pillsoo.cabinet.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import org.sos.pillsoo.cabinet.entity.Cabinet;


import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "Alarm")
public class Alarm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long alarmSeq;

    @ManyToOne
    @JoinColumn(name = "mykitSeq")
    private Cabinet cabinet;

    private boolean isUsed;
    private Date alarm;
}

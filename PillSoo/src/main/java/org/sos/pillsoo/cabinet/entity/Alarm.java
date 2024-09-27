package org.sos.pillsoo.mykit.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
<<<<<<< Updated upstream:PillSoo/src/main/java/org/sos/pillsoo/mykit/entity/Alarm.java
=======
import org.sos.pillsoo.cabinet.entity.Cabinet;

>>>>>>> Stashed changes:PillSoo/src/main/java/org/sos/pillsoo/alarm/entity/Alarm.java

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

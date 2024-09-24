package org.sos.pillsoo.supplement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.CurrentTimestamp;

import java.sql.Timestamp;

@Getter
@Entity
@Table(name = "click_count")
public class ClickCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long recordSeq;
    private int supplementSeq;
    private int userSeq;
    @CurrentTimestamp
    private Timestamp clickSeq;
}

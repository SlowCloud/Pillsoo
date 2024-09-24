package org.sos.pillsoo.supplement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.CurrentTimestamp;
import org.sos.pillsoo.auth.entity.User;

import java.sql.Timestamp;

@Getter
@Entity
@Table(name = "click_count")
public class ClickCount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long recordSeq;

    @ManyToOne
    @JoinColumn(name = "supplement_seq")
    private Supplement supplement;

    @ManyToOne
    @JoinColumn(name = "user_seq")
    private User user;

    @CurrentTimestamp
    private Timestamp clickSeq;
}

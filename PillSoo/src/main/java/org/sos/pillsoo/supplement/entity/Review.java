package org.sos.pillsoo.supplement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@Table(name = "Review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long reviewSeq;

    @ManyToOne
    @JoinColumn(name = "supplementSeq", referencedColumnName = "supplementSeq")
    private Supplement supplement;  // Supplement와의 관계 정의

    private int userSeq;

    // supplementSeq는 ManyToOne 관계로 이미 매핑되었으므로 제거
    // private int supplementSeq; -> 제거

    private String content;
    private Timestamp createdAt;
    private int rating;

    // Getters and Setters
}

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
    private Supplement supplement;

    private int userSeq;
    private String content;
    private Timestamp createdAt;
    private int rating;

    // Getters and Setters
}

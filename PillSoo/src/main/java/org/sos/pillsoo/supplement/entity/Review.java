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
    private String content;
    private Timestamp createdAt;
    private int rating;

    // 자동으로 createdAt 필드를 현재 시간으로 설정하는 로직
    @PrePersist
    protected void onCreate() {
        this.createdAt = new Timestamp(System.currentTimeMillis());
    }
}

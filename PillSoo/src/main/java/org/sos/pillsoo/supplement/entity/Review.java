package org.sos.pillsoo.supplement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@Entity
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
    private String nickName;

    @CreationTimestamp
    private Timestamp createdAt;
    private int rating;

}

package org.sos.pillsoo.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

@Setter
@Getter
@ToString
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userSeq;

    @Column(unique = true, nullable = false)
    private String userId;

    private String nickname;
    private int age;
    private String password;
    private String gender;
    private Timestamp createdAt;
    private Timestamp withdrawalAt;
    private String role;

    @Column(nullable = true)
    private String fcmToken;
}

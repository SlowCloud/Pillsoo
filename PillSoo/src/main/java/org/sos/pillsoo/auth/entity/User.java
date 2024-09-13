package org.sos.pillsoo.auth.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Entity
@Setter
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userSeq;
    private String userId;
    private String nickname;
    private int age;
    private String password;
    private String gender;
    private Timestamp createdAt;
    private Timestamp withdrawalAt;
    private String role;
}

package org.sos.pillsoo.auth.dto;

import lombok.Data;

@Data
public class SignupDto {

    private String userId;
    private String password;
    private String nickname;
    private int age;
    private boolean gender;
}


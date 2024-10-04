package org.sos.pillsoo.auth.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String nickname;
    private String password;
    private int age;
    private String gender;

}

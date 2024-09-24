package org.sos.pillsoo.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateDto {
    private String nickname;
    private String password;
    private int age;
    private String gender;

}

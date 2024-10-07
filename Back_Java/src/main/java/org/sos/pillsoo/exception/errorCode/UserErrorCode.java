package org.sos.pillsoo.exception.errorCode;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum UserErrorCode implements ErrorCode {
    USER_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 존재하는 유저 아이디입니다."),
    NOT_CURRENT_USER(HttpStatus.BAD_REQUEST, "사용자는 자신의 데이터만 수정할 수 있습니다."),
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "해당하는 사용자가 존재하지 않습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    UserErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    @Override
    public String getErrorCode() {
        return name();
    }
}

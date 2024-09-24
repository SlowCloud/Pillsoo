package org.sos.pillsoo.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    INPUT_FAILURE(HttpStatus.BAD_REQUEST, "입력값이 잘못되었습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    ErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    public String getErrorCode() {
        return name();
    }

}

package org.sos.pillsoo.exception.errorCode;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum AlarmErrorCode implements ErrorCode {
    ALARM_NOT_FOUND(HttpStatus.BAD_REQUEST, "해당 알람이 존재하지 않습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    AlarmErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    @Override
    public String getErrorCode() {
        return name();
    }
}

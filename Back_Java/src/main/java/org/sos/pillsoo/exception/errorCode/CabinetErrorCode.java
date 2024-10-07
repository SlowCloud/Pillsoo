package org.sos.pillsoo.exception.errorCode;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum CabinetErrorCode implements ErrorCode {
    CABINET_NOT_FOUND(HttpStatus.BAD_REQUEST, "복용 중인 영양제 중 해당 영양제가 존재하지 않습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    CabinetErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    @Override
    public String getErrorCode() {
        return name();
    }
}

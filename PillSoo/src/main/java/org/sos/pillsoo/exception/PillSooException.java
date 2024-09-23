package org.sos.pillsoo.exception;

import lombok.Getter;

@Getter
public class PillSooException extends RuntimeException {

    private final ErrorCode errorCode;

    public PillSooException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

}

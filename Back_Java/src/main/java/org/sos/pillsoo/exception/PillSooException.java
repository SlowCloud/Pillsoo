package org.sos.pillsoo.exception;

import lombok.Getter;
import org.sos.pillsoo.exception.errorCode.ErrorCode;

@Getter
public class PillSooException extends RuntimeException {

    private final ErrorCode errorCode;

    public PillSooException(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

}

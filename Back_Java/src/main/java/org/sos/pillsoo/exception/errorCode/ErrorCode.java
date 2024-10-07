package org.sos.pillsoo.exception.errorCode;

public interface ErrorCode {
    String getErrorCode();

    org.springframework.http.HttpStatus getHttpStatus();

    String getMessage();
}

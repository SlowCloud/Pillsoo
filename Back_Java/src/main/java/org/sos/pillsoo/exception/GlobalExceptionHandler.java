package org.sos.pillsoo.exception;

import org.sos.pillsoo.exception.errorCode.ErrorCode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PillSooException.class)
    public ProblemDetail handlePillSooException(PillSooException e) {
        e.printStackTrace();
        ErrorCode errorCode = e.getErrorCode();
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(errorCode.getHttpStatus(), errorCode.getMessage());
        return new PillSooProblemDetail(problemDetail, errorCode.getErrorCode());
    }

    @ExceptionHandler
    public ProblemDetail handleException(Exception e) {
        e.printStackTrace();
        return ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

}

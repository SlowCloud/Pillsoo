package org.sos.pillsoo.exception;

import lombok.Getter;
import org.springframework.http.ProblemDetail;

@Getter
public class PillSooProblemDetail extends ProblemDetail {

    private final String errorCode;

    public PillSooProblemDetail(ProblemDetail problemDetail, String errorCode) {
        super(problemDetail);
        this.errorCode = errorCode;
    }

}

package org.sos.pillsoo.supplement.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
public class ReviewDto {
    private long reviewSeq;
    private int userSeq;
    private String userName;
    private String content;
    private Timestamp createdAt;  // createdAt 필드 추가
}

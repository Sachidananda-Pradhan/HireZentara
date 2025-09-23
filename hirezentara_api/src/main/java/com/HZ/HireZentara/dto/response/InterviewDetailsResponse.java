package com.HZ.HireZentara.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class InterviewDetailsResponse {

    private String interviewId;
    private String interviewRound;
    private Date interviewDate;
    private String interviewStartTime;
    private String interviewEndTime;
    private String interviewerName;
    private String interviewerEmail;
    private String interviewType;
    private String interviewFeedback;
    private String meetingPlatform;
    private String candidateId;
    private String candidateName;
    private String feedback;
    private Boolean isCancelled;
    private Date createdAt;
    private Date cancelledAt;
}

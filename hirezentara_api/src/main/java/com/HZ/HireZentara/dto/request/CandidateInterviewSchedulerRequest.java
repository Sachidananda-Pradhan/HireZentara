package com.HZ.HireZentara.dto.request;

import lombok.Data;

import java.util.Date;
@Data
public class CandidateInterviewSchedulerRequest {

   private  String interviewtype;
   private  String interviewRound;
   private  Date   interviewDate;
   private  String interviewStartTime;
   private  String interviewEndTime;
   private  String interviewTimeInHR;
   private  String meetingPlatform;
   private  String interviewName;
   private  String interviewEmail;
}

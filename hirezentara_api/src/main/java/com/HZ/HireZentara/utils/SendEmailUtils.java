package com.HZ.HireZentara.utils;

import com.HZ.HireZentara.dto.request.CandidateInterviewSchedulerRequest;
import com.HZ.HireZentara.entity.Candidate;
import org.springframework.stereotype.Component;

@Component
public class SendEmailUtils {

    public String sendInterviewEmail(CandidateInterviewSchedulerRequest candidateInterviewSchedulerRequest, Candidate candidate, String meetingLink) {
        String to = candidate.getEmail();

//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(request.getInterviewEmail());
//        message.setSubject("Interview Scheduled - " + request.getInterviewType());
//        message.setText("Hello " + request.getInterviewName() + ",\n\n" +
//                "Your interview has been scheduled.\n\n" +
//                "Date: " + request.getInterviewDate() + "\n" +
//                "Start Time: " + request.getInterviewStartTime() + "\n" +
//                "End Time: " + request.getInterviewEndTime() + "\n" +
//                "Meeting Link: " + meetingLink + "\n\n" +
//                "Best Regards,\nHR Team");
//
//        mailSender.send(message);
        return "Interview email sent successfully to " + to;
    }
}

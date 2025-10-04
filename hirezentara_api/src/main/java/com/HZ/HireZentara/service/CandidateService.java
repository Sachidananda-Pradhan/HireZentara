package com.HZ.HireZentara.service;

import com.HZ.HireZentara.dto.CandidateResponse;
import com.HZ.HireZentara.dto.request.CandidateInterviewSchedulerRequest;
import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.response.CandidateAndJobDetailsResponse;
import com.HZ.HireZentara.dto.response.CandidateRegistrationResposne;
import com.HZ.HireZentara.dto.response.InterviewDetailsResponse;
import com.HZ.HireZentara.entity.InterviewDetails;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface CandidateService {

    CandidateRegistrationResposne registerCandidate(@Valid CandidateRegistrationRequest candidateRegistrationRequest, MultipartFile resume);

    CandidateAndJobDetailsResponse getCandidateById(String candidateId);

    String deleteCandidateById(String candidateId);

    String updateCandidateStatus(String candidateId, String candidateStatus);

    String scheduleInterview(CandidateInterviewSchedulerRequest candidateInterviewSchedulerRequest, String candidateId);

    String cancelInterview(String candidateId, Long interviewId);


    List<InterviewDetailsResponse> getInterviewSlots(String candidateId);

    InterviewDetails getInterviewDetails(String candidateId, Long interviewId);

    String reScheduleInterview(CandidateInterviewSchedulerRequest candidateInterviewSchedulerRequest, String candidateId, Long interviewId);

    String updateCandidateImage(String candidateId, MultipartFile candidateImage);
}

package com.HZ.HireZentara.service;

import com.HZ.HireZentara.dto.CandidateResponse;
import com.HZ.HireZentara.dto.request.CandidateInterviewSchedulerRequest;
import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.response.CandidateAndJobDetailsResponse;
import com.HZ.HireZentara.dto.response.CandidateRegistrationResposne;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface CandidateService {

    CandidateRegistrationResposne registerCandidate(@Valid CandidateRegistrationRequest candidateRegistrationRequest, MultipartFile resume);

    CandidateAndJobDetailsResponse getCandidateById(String candidateId);

    String deleteCandidateById(String candidateId);

    String updateCandidateStatus(String candidateId, String status);

    String scheduleInterview(CandidateInterviewSchedulerRequest candidateInterviewSchedulerRequest, String candidateId);

    String cancelInterview(String candidateId, Long interviewId);
}

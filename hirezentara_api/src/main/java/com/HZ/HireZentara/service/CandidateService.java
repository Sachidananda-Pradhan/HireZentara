package com.HZ.HireZentara.service;

import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.response.CandidateRegistrationResposne;
import com.HZ.HireZentara.entity.Candidate;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface CandidateService {

    CandidateRegistrationResposne registerCandidate(@Valid CandidateRegistrationRequest candidateRegistrationRequest, MultipartFile resume);

    Candidate getCandidateById(String candidateid);
}

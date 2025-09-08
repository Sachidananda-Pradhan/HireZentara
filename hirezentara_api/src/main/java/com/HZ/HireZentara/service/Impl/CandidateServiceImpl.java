package com.HZ.HireZentara.service.Impl;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.response.CandidateRegistrationResposne;
import com.HZ.HireZentara.entity.Candidate;
import com.HZ.HireZentara.exceptions.CandidateExistsException;
import com.HZ.HireZentara.repository.CandidateRepository;
import com.HZ.HireZentara.service.CandidateService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;

@Service
public class CandidateServiceImpl implements CandidateService {

    private  final CandidateRepository candidateRepository;

    public CandidateServiceImpl(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @Override
    public CandidateRegistrationResposne registerCandidate(CandidateRegistrationRequest candidateRegistrationRequest, MultipartFile resume) {
        // check if candidate with same email already exists
        if (candidateRegistrationRequest.getEmail() != null && candidateRepository.findByEmail(candidateRegistrationRequest.getEmail()).isPresent()) {
            throw new CandidateExistsException(null, 409, "Candidate with same email already exists");
        }

        // check if candidate with same phone number already exists
        if (candidateRegistrationRequest.getMobileNo() != null && candidateRepository.findByMobileNo(candidateRegistrationRequest.getMobileNo()).isPresent()) {
            throw new CandidateExistsException(null, 409, "Candidate with same phone number already exists");
        }
        saveCandidate(candidateRegistrationRequest, resume);
        return new CandidateRegistrationResposne("Candidate registered successfully");
    }

    private void saveCandidate(CandidateRegistrationRequest candidateRegistrationRequest, MultipartFile resume) {
        Candidate candidate = new Candidate();
        candidate.setFirstName(candidateRegistrationRequest.getFirstName());
        candidate.setLastName(candidateRegistrationRequest.getLastName());
        candidate.setEmail(candidateRegistrationRequest.getEmail());
        candidate.setReEnterEmail(candidateRegistrationRequest.getReEnterEmail());
        candidate.setMobileNo(candidateRegistrationRequest.getMobileNo());
        candidate.setMobileNo(candidateRegistrationRequest.getMobileNo());
        candidate.setLinkedInProfile(candidateRegistrationRequest.getLinkedInProfile());
        candidate.setWebsite(candidateRegistrationRequest.getWebsite());
        candidate.setCreatedAt(new Date());
        candidate.setCreatedBy(ApplicationConstant.CANDIDATE);

        // handle file upload if needed
        if (resume != null && !resume.isEmpty()) {
            try {
                candidate.setResume(resume.getBytes()); // if you want to store in DB
            } catch (IOException e) {
                throw new RuntimeException("Error saving resume file", e);
            }
        }
        // save candidate
        candidateRepository.save(candidate);
    }
}

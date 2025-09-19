package com.HZ.HireZentara.service.Impl;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.CandidateResponse;
import com.HZ.HireZentara.dto.request.CandidateInterviewSchedulerRequest;
import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.response.CandidateAndJobDetailsResponse;
import com.HZ.HireZentara.dto.response.CandidateRegistrationResposne;
import com.HZ.HireZentara.entity.Candidate;
import com.HZ.HireZentara.entity.InterviewDetails;
import com.HZ.HireZentara.entity.JobDetails;
import com.HZ.HireZentara.enums.CandidateStatus;
import com.HZ.HireZentara.exceptions.CandidateExistsException;
import com.HZ.HireZentara.repository.CandidateRepository;
import com.HZ.HireZentara.repository.InterviewRepository;
import com.HZ.HireZentara.repository.JobDetailsRepository;
import com.HZ.HireZentara.service.CandidateService;
import com.HZ.HireZentara.utils.MeetEventCreation;
import com.HZ.HireZentara.utils.SendEmailUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Date;

@Service
public class CandidateServiceImpl implements CandidateService {

    private  final CandidateRepository candidateRepository;
    private  final JobDetailsRepository jobDetailsRepository;
    private  final MeetEventCreation meetEventCreation;
    private  final SendEmailUtils sendEmailUtils;
    private  final InterviewRepository interviewRepository;

    public CandidateServiceImpl(CandidateRepository candidateRepository, JobDetailsRepository jobDetailsRepository, MeetEventCreation meetEventCreation, SendEmailUtils sendEmailUtils, InterviewRepository interviewRepository) {
        this.candidateRepository = candidateRepository;
        this.jobDetailsRepository = jobDetailsRepository;
        this.meetEventCreation = meetEventCreation;
        this.sendEmailUtils = sendEmailUtils;
        this.interviewRepository = interviewRepository;
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

        JobDetails jobDetails = jobDetailsRepository.findByJobId(candidateRegistrationRequest.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        saveCandidate(candidateRegistrationRequest, resume,jobDetails);
        return new CandidateRegistrationResposne("Candidate registered successfully");
    }
    private void saveCandidate(CandidateRegistrationRequest candidateRegistrationRequest, MultipartFile resume,JobDetails jobDetails) {
        Candidate candidate = new Candidate();
        candidate.setFirstName(candidateRegistrationRequest.getFirstName());
        candidate.setLastName(candidateRegistrationRequest.getLastName());
        candidate.setFullName(candidateRegistrationRequest.getFirstName() + " " + candidateRegistrationRequest.getLastName());
        candidate.setEmail(candidateRegistrationRequest.getEmail());
        candidate.setReEnterEmail(candidateRegistrationRequest.getReEnterEmail());
        candidate.setMobileNo(candidateRegistrationRequest.getMobileNo());
        candidate.setCurrentlocation(candidateRegistrationRequest.getCurrentlocation());
        candidate.setLinkedInProfile(candidateRegistrationRequest.getLinkedInProfile());
        candidate.setWebsite(candidateRegistrationRequest.getWebsite());
        candidate.setCandidateStatus(CandidateStatus.APPLIED);
        candidate.setJobDetails(jobDetails);
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

    @Override
    public CandidateAndJobDetailsResponse getCandidateById(String candidateId) {
        Candidate candidate = candidateRepository.findById(Integer.valueOf(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        CandidateAndJobDetailsResponse candidateAndJobDetailsResponse = new CandidateAndJobDetailsResponse();
        candidateAndJobDetailsResponse.setCandidateId(candidate.getId());
        candidateAndJobDetailsResponse.setName(candidate.getFullName());
        candidateAndJobDetailsResponse.setEmail(candidate.getEmail());
        candidateAndJobDetailsResponse.setAppliedDate(candidate.getCreatedAt());
        candidateAndJobDetailsResponse.setCandidateStatus(candidate.getCandidateStatus());
        candidateAndJobDetailsResponse.setCurrentLocation(candidate.getCurrentlocation());
        candidateAndJobDetailsResponse.setResume(Base64.getEncoder().encodeToString(candidate.getResume()));
        candidateAndJobDetailsResponse.setMobileNo(candidate.getMobileNo());
        candidateAndJobDetailsResponse.setLinkedInProfile(candidate.getLinkedInProfile());
        candidateAndJobDetailsResponse.setJobTitle(candidate.getJobDetails().getJobTitle());
        //candidateAndJobDetailsResponse.setExperience(candidate.getJobDetails().getExperience());
        //candidateAndJobDetailsResponse.setAvailabilityNoticePeriod(candidate.getJobDetails().getAvailabilityNoticePeriod());

        return candidateAndJobDetailsResponse;

    }

    @Override
    public String deleteCandidateById(String candidateId) {

        Candidate candidate = candidateRepository.findById((int) Long.parseLong(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidateRepository.deleteById((int) Long.parseLong(candidateId));
        return " Successfully deleted candidate : " + candidate.getFullName();
    }

    @Override
    public String updateCandidateStatus(String candidateId, String status) {
        Candidate candidate = candidateRepository.findById((int) Long.parseLong(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        try {
            CandidateStatus candidateStatus = CandidateStatus.valueOf(status.toUpperCase());
            candidate.setCandidateStatus(candidateStatus);
            candidateRepository.save(candidate);
            return "Candidate status updated successfully to " + candidateStatus;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + status);
        }
    }

    @Override
    public String scheduleInterview(CandidateInterviewSchedulerRequest candidateInterviewSchedulerRequest, String candidateId) {
        Candidate candidate = candidateRepository.findById((int) Long.parseLong(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        String meetingLink;
        switch (candidateInterviewSchedulerRequest.getMeetingPlatform().toLowerCase()) {
            case "google meet":
                meetingLink = meetEventCreation.createGoogleMeetEvent(candidateInterviewSchedulerRequest);
                break;

            case "microsoft teams":
                meetingLink = meetEventCreation.createMicrosoftTeamsEvent(candidateInterviewSchedulerRequest);
                break;

            case "zoom":
                meetingLink = meetEventCreation.createZoomMeeting(candidateInterviewSchedulerRequest);
                break;

            default:
                throw new IllegalArgumentException("Unsupported meeting platform: " + candidateInterviewSchedulerRequest.getMeetingPlatform());
        }

        saveInterviewDetails(candidateInterviewSchedulerRequest, candidate, meetingLink);
        // Send Email Notification
        sendEmailUtils.sendInterviewEmail(candidateInterviewSchedulerRequest,candidate, meetingLink);

        return "Interview scheduled successfully on " + candidateInterviewSchedulerRequest.getMeetingPlatform() +
                " with link: " + meetingLink;
    }



    private void saveInterviewDetails(CandidateInterviewSchedulerRequest candidateInterviewSchedulerRequest, Candidate candidate, String meetingLink) {
        candidate.setCandidateStatus(CandidateStatus.INTERVIEW_SCHEDULED);
        candidateRepository.save(candidate);
        // Here, you might want to create an Interview entity to store interview details
        InterviewDetails interviewDetails = new InterviewDetails();
        interviewDetails.setInterviewRound(candidateInterviewSchedulerRequest.getInterviewRound());
        interviewDetails.setInterviewDate(candidateInterviewSchedulerRequest.getInterviewDate());
        interviewDetails.setInterviewStartTime(candidateInterviewSchedulerRequest.getInterviewStartTime());
        interviewDetails.setInterviewEndTime(candidateInterviewSchedulerRequest.getInterviewEndTime());
        interviewDetails.setInterviewerName(candidateInterviewSchedulerRequest.getInterviewName());
        interviewDetails.setInterviewerEmail(candidateInterviewSchedulerRequest.getInterviewEmail());
        interviewDetails.setInterviewType(candidateInterviewSchedulerRequest.getInterviewtype());
        interviewDetails.setMeetingPlatform(candidateInterviewSchedulerRequest.getMeetingPlatform());
        interviewDetails.setCandidate(candidate);
        interviewRepository.save(interviewDetails);
    }

    @Override
    public String cancelInterview(String candidateId, Long interviewId) {
        Candidate candidate = candidateRepository.findById((int) Long.parseLong(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        InterviewDetails interviewDetails = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        if (!interviewDetails.getCandidate().getId().equals(candidate.getId())) {
            throw new RuntimeException("Interview does not belong to the specified candidate");
        }
        deleteInterview(interviewDetails.getId());
        return "Interview cancelled successfully for candidate: " + candidate.getFullName();
    }

    private void deleteInterview(Long id) {
        interviewRepository.deleteById(id);
    }


}

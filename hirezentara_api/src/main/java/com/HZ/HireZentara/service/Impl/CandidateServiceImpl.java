package com.HZ.HireZentara.service.Impl;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.request.CandidateInterviewSchedulerRequest;
import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.response.CandidateAndJobDetailsResponse;
import com.HZ.HireZentara.dto.response.CandidateRegistrationResposne;
import com.HZ.HireZentara.dto.response.InterviewDetailsResponse;
import com.HZ.HireZentara.dto.response.PageResponse;
import com.HZ.HireZentara.entity.Candidate;
import com.HZ.HireZentara.entity.InterviewDetails;
import com.HZ.HireZentara.entity.JobDetails;
import com.HZ.HireZentara.enums.CandidateStatus;
import com.HZ.HireZentara.enums.InterviewStatus;
import com.HZ.HireZentara.exceptions.CandidateExistsException;
import com.HZ.HireZentara.repository.CandidateRepository;
import com.HZ.HireZentara.repository.InterviewRepository;
import com.HZ.HireZentara.repository.JobDetailsRepository;
import com.HZ.HireZentara.service.CandidateService;
import com.HZ.HireZentara.utils.MeetEventCreation;
import com.HZ.HireZentara.utils.SendEmailUtils;
import org.springframework.boot.autoconfigure.batch.BatchProperties;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Locale.filter;

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
    public String updateCandidateImage(String candidateId, MultipartFile candidateImage) {
        Candidate candidate = candidateRepository.findById((int) Long.parseLong(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        // handle file upload if needed
        if (candidateImage != null && !candidateImage.isEmpty()) {
            try {
                candidate.setCandidateImage(candidateImage.getBytes()); // if you want to store in DB
                candidate.setUpdatedAt(new Date());
                candidate.setUpdatedBy(ApplicationConstant.CANDIDATE);
            } catch (IOException e) {
                throw new RuntimeException("Error saving candidate image file", e);
            }
        }

        candidateRepository.save(candidate);
        return "Candidate image updated successfully for candidate: " + candidate.getFullName();
    }


    @Override
    public CandidateAndJobDetailsResponse getCandidateById(String candidateId) {
        Candidate candidate = candidateRepository.findById(Integer.valueOf(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
         byte[] candidateImage = candidate.getCandidateImage();
         String candidateImageBase64 = Base64.getEncoder().encodeToString(candidateImage);
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
        candidateAndJobDetailsResponse.setCandidateImage(candidateImageBase64);
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
    public String updateCandidateStatus(String candidateId, String candidateStatus) {
        Candidate candidate = candidateRepository.findById((int) Long.parseLong(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        try {
            CandidateStatus statustatus = CandidateStatus.valueOf(candidateStatus.toUpperCase());
            candidate.setCandidateStatus(statustatus);
            candidateRepository.save(candidate);
            return "Candidate status updated successfully to " + candidateStatus;
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + candidateStatus);
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
        candidate.setCandidateStatus(CandidateStatus.TECHNICAL_INTERVIEW);
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
        interviewDetails.setJobDetails(candidate.getJobDetails());
        interviewDetails.setIsCancelled(false);
        interviewDetails.setInterviewStatus(InterviewStatus.SCHEDULED);
        interviewDetails.setCreatedAt(new Date());
        interviewDetails.setCreatedBy(ApplicationConstant.ADMIN);
        interviewRepository.save(interviewDetails);
    }


    @Override
    public List<InterviewDetailsResponse> getInterviewSlots(String candidateId) {
        Candidate candidate = candidateRepository.findById(Integer.valueOf(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        List<InterviewDetails> interviewDetailsList  = interviewRepository.findInterviewByCandidateId(Long.parseLong(String.valueOf(Integer.valueOf(candidateId))));

        if (interviewDetailsList == null || interviewDetailsList.isEmpty()) {
            return Collections.emptyList();
        }

        return interviewDetailsList.stream()
                .filter(i -> i.getCandidate().getId().equals(candidate.getId()))
                .sorted(Comparator.comparing(InterviewDetails::getInterviewDate))
                .map(interview -> {
                    InterviewDetailsResponse response = new InterviewDetailsResponse();
                    response.setInterviewId(String.valueOf(interview.getId()));
                    response.setInterviewRound(interview.getInterviewRound());
                    response.setInterviewDate(interview.getInterviewDate());
                    response.setInterviewStartTime(interview.getInterviewStartTime());
                    response.setInterviewEndTime(interview.getInterviewEndTime());
                    response.setInterviewerName(interview.getInterviewerName());
                    response.setInterviewerEmail(interview.getInterviewerEmail());
                    response.setInterviewType(interview.getInterviewType());
                    response.setInterviewFeedback(interview.getInterviewFeedback());
                    response.setMeetingPlatform(interview.getMeetingPlatform());
                    response.setCandidateId(candidateId);
                    response.setCandidateName(candidate.getFullName());
                    response.setIsCancelled(interview.getIsCancelled());
                    response.setCreatedAt(interview.getCreatedAt());
                    response.setCancelledAt(interview.getCancelledAt());
                    response.setInterviewStatus(interview.getInterviewStatus());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public InterviewDetails getInterviewDetails(String candidateId, Long interviewId) {
        Candidate candidate = candidateRepository.findById((int) Long.parseLong(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        InterviewDetails interviewDetails = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        if (!interviewDetails.getCandidate().getId().equals(candidate.getId())) {
            throw new RuntimeException("Interview does not belong to the specified candidate");
        }else {
            return interviewDetails;
        }
    }

    @Override
    public String reScheduleInterview(CandidateInterviewSchedulerRequest candidateInterviewSchedulerRequest, String candidateId, Long interviewId) {
        Candidate candidate = candidateRepository.findById((int) Long.parseLong(candidateId))
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        InterviewDetails interviewDetails = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview details  not found"));
        if (!interviewDetails.getCandidate().getId().equals(candidate.getId())) {
            throw new RuntimeException("Interview does not belong to the specified candidate");
        }
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
        // Update interview details
        interviewDetails.setInterviewRound(candidateInterviewSchedulerRequest.getInterviewRound());
        interviewDetails.setInterviewDate(candidateInterviewSchedulerRequest.getInterviewDate());
        interviewDetails.setInterviewStartTime(candidateInterviewSchedulerRequest.getInterviewStartTime());
        interviewDetails.setInterviewEndTime(candidateInterviewSchedulerRequest.getInterviewEndTime());
        interviewDetails.setInterviewerName(candidateInterviewSchedulerRequest.getInterviewName());
        interviewDetails.setInterviewerEmail(candidateInterviewSchedulerRequest.getInterviewEmail());
        interviewDetails.setInterviewType(candidateInterviewSchedulerRequest.getInterviewtype());
        interviewDetails.setMeetingPlatform(candidateInterviewSchedulerRequest.getMeetingPlatform());
        interviewDetails.setInterviewStatus(InterviewStatus.RESCHEDULED);
        interviewDetails.setUpdatedAt(new Date());
        interviewDetails.setUpdatedBy(ApplicationConstant.ADMIN);
        interviewRepository.save(interviewDetails);
        // Send Email Notification
        sendEmailUtils.sendInterviewEmail(candidateInterviewSchedulerRequest,candidate, meetingLink);

            return "Interview rescheduled successfully on " + candidateInterviewSchedulerRequest.getMeetingPlatform() +
                    " with link: " + meetingLink;
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
        interviewDetails.setInterviewStatus(InterviewStatus.CANCELLED);
        interviewDetails.setIsCancelled(true);
        interviewDetails.setCancelledAt(new Date());
        interviewRepository.save(interviewDetails);
        return "Interview cancelled successfully for candidate: " + candidate.getFullName();
    }
    @Override
    public PageResponse getAllInterviewSlots(String  jobId,
                                             Optional<Integer> pageNumber,
                                             Optional<Integer> pageSize,
                                             boolean isRecent,
                                             Optional<Integer> days,
                                             Optional<Integer> hours,
                                             List<String> interviewStatus,
                                             String sortFlag,
                                             String sortBy,
                                             Optional<String> search) {
        int page = pageNumber.orElse(0);
        int size = pageSize.orElse(10);
        Sort sort = sortFlag.equalsIgnoreCase("true") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // Fetch all interview details sorted by creation date
        List<InterviewDetails> interviewDetails = interviewRepository.findAll(Sort.by("createdAt").descending());

        if (jobId != null) {
            Optional<JobDetails> jobOptional = jobDetailsRepository.findByJobId(jobId);
            if (jobOptional.isPresent()) {
                Long jobPrimaryId = jobOptional.get().getId();
                interviewDetails = interviewDetails.stream()
                        .filter(slot -> slot.getJobDetails() != null &&
                                slot.getJobDetails().getId().equals(jobPrimaryId))
                        .collect(Collectors.toList());
            } else {
                // No matching job found — return empty list or handle gracefully
                interviewDetails = Collections.emptyList();
            }
        }

        // Filter by interview status
        if (!interviewStatus.contains("ALL")) {
            interviewDetails = interviewDetails.stream()
                    .filter(slot -> interviewStatus.contains(slot.getInterviewStatus().name()))
                    .collect(Collectors.toList());
        }

        // Filter by recent days
        if (isRecent && days.isPresent()) {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.DAY_OF_YEAR, -days.get());
            Date thresholdDate = calendar.getTime();

            interviewDetails = interviewDetails.stream()
                    .filter(slot -> slot.getInterviewDate() != null && slot.getInterviewDate().after(thresholdDate))
                    .collect(Collectors.toList());
        }

        // Filter by recent hours
        if (isRecent && hours.isPresent()) {
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.HOUR_OF_DAY, -hours.get());
            Date thresholdDate = calendar.getTime();
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            interviewDetails = interviewDetails.stream()
                    .filter(slot -> {
                        try {
                            Date startTime = formatter.parse(slot.getInterviewStartTime());
                            return startTime.after(thresholdDate);
                        } catch (ParseException e) {
                            return false;
                        }
                    })
                    .collect(Collectors.toList());
        }

        // Filter by search keyword
        if (search.isPresent()) {
            String keyword = search.get().toLowerCase();
            interviewDetails = interviewDetails.stream()
                    .filter(slot -> slot.getCandidate() != null &&
                            (slot.getCandidate().getFullName().toLowerCase().contains(keyword) ||
                                    slot.getCandidate().getMobileNo().toLowerCase().contains(keyword)))
                    .collect(Collectors.toList());
        }

        // Pagination
        int start = Math.toIntExact(pageable.getOffset());
        int end = Math.min(start + pageable.getPageSize(), interviewDetails.size());
        List<InterviewDetailsResponse> pagedResponses = (start <= end)
                ? interviewDetails.subList(start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList())
                : Collections.emptyList();

        int totalRecords = interviewDetails.size();
        int totalPages = (int) Math.ceil((double) totalRecords / size);

        return new PageResponse(pagedResponses, page, totalRecords, totalPages);

    }

    private InterviewDetailsResponse mapToResponse(InterviewDetails interviewDetails) {
        InterviewDetailsResponse response = new InterviewDetailsResponse();
        response.setInterviewId(String.valueOf(interviewDetails.getId()));
        response.setInterviewRound(interviewDetails.getInterviewRound());
        response.setInterviewDate(interviewDetails.getInterviewDate());
        response.setInterviewStartTime(interviewDetails.getInterviewStartTime());
        response.setInterviewEndTime(interviewDetails.getInterviewEndTime());
        response.setInterviewerName(interviewDetails.getInterviewerName());
        response.setInterviewerEmail(interviewDetails.getInterviewerEmail());
        response.setInterviewType(interviewDetails.getInterviewType());
        response.setInterviewFeedback(interviewDetails.getInterviewFeedback());
        response.setMeetingPlatform(interviewDetails.getMeetingPlatform());
        response.setCandidateId(String.valueOf(interviewDetails.getCandidate().getId()));
        response.setCandidateName(interviewDetails.getCandidate().getFullName());
        response.setCandidateMobileNo(interviewDetails.getCandidate().getMobileNo());
        response.setIsCancelled(interviewDetails.getIsCancelled());
        response.setCreatedAt(interviewDetails.getCreatedAt());
        response.setCancelledAt(interviewDetails.getCancelledAt());
        response.setInterviewStatus(interviewDetails.getInterviewStatus());
        return response;
    }
}

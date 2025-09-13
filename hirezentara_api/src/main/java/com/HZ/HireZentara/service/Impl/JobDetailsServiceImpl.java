package com.HZ.HireZentara.service.Impl;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.CandidateDto;
import com.HZ.HireZentara.dto.request.JobDetailsRequest;
import com.HZ.HireZentara.dto.response.*;
import com.HZ.HireZentara.entity.Candidate;
import com.HZ.HireZentara.entity.JobDetails;
import com.HZ.HireZentara.enums.JobStatus;
import com.HZ.HireZentara.repository.CandidateRepository;
import com.HZ.HireZentara.repository.JobDetailsRepository;
import com.HZ.HireZentara.service.JobDetailsService;
import com.HZ.HireZentara.utils.ApplicationDateTimeUtil;
import com.HZ.HireZentara.utils.ExcelReportGenerator;
import com.HZ.HireZentara.utils.IDGenerator;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobDetailsServiceImpl implements JobDetailsService {

     private final JobDetailsRepository jobDetailsRepository;
     private final ApplicationDateTimeUtil applicationDateTimeUtil;
     private final CandidateRepository candidateRepository;
     private final ExcelReportGenerator excelReportGenerator;


    public JobDetailsServiceImpl(JobDetailsRepository jobDetailsRepository, ApplicationDateTimeUtil applicationDateTimeUtil, CandidateRepository candidateRepository, ExcelReportGenerator excelReportGenerator) {
        this.jobDetailsRepository = jobDetailsRepository;
        this.applicationDateTimeUtil = applicationDateTimeUtil;
        this.candidateRepository = candidateRepository;
        this.excelReportGenerator = excelReportGenerator;
    }

    @Override
    public JobResponse createJob(JobDetailsRequest jobDetailsRequest) {
        String jobId = IDGenerator.createJobId();
        Date jobPostedDate = new Date();
        Date jobExpiringDate  = applicationDateTimeUtil.createJobExpiringDate(jobDetailsRequest.getExpiringDayOfJob(),jobPostedDate);
        String encryptedToken = IDGenerator.generateEncryptedToken(jobId,jobPostedDate);
        String joblink = "https://hirezentara.com/job/"+encryptedToken;

        JobDetails jobDetails = new JobDetails();
        jobDetails.setJobId(jobId);
        jobDetails.setJobTitle(jobDetailsRequest.getJobTitle());
        jobDetails.setJobDescription(jobDetailsRequest.getJobDescription());
        jobDetails.setLocation(jobDetailsRequest.getLocation());
        jobDetails.setRolesAndResponsibilities(  String.join(",", jobDetailsRequest.getRolesAndResponsibilities()));
        jobDetails.setSkillsAndExperience(String.join(",", jobDetailsRequest.getSkillsAndExperience()));
        jobDetails.setJobStatus(JobStatus.OPEN);
        jobDetails.setPostedDate(jobPostedDate);
        jobDetails.setClosingDayofJob(jobExpiringDate);
        jobDetails.setJobLink(joblink);
        jobDetails.setCreatedBy(ApplicationConstant.ADMIN);
        jobDetails.setCreatedAt(new Date());

        // Save to database
        jobDetailsRepository.save(jobDetails);
        JobResponse  jobResponse = new JobResponse();
        jobResponse.setJobLink(joblink);

        return jobResponse;
    }

    @Override
    public PageResponse getAllJobDetails(Optional<Integer> pageSize, Optional<Integer> pageNumber, boolean isRecent, Optional<Integer> days, List<String> jobStatus, String sortFlag, String sortBy, Optional<String> search) {
                int page = pageNumber.orElse(0);
                int size = pageSize.orElse(10);
                Sort sort = sortFlag.equalsIgnoreCase("true") ?
                        Sort.by(sortBy).descending() :
                        Sort.by(sortBy).ascending();

                Pageable pageable = (Pageable) PageRequest.of(page, size, sort);
                // Fetch all jobs
                List<JobDetails> allJobs = jobDetailsRepository.findAll();
                // Filter by job status
                if (!jobStatus.contains("ALL")) {
                    allJobs = allJobs.stream()
                            .filter(job -> jobStatus.contains(job.getJobStatus().name()))
                            .collect(Collectors.toList());
                }
                // Filter by recent jobs
                if (isRecent && days.isPresent()) {
                    Calendar calendar = Calendar.getInstance();
                    calendar.add(Calendar.DAY_OF_YEAR, -days.get());
                    Date thresholdDate = calendar.getTime();

                    allJobs = allJobs.stream()
                            .filter(job -> job.getPostedDate().after(thresholdDate))
                            .collect(Collectors.toList());
                }
                // Filter by search keyword
                if (search.isPresent()) {
                    String keyword = search.get().toLowerCase();
                    allJobs = allJobs.stream()
                            .filter(job -> job.getJobTitle().toLowerCase().contains(keyword) ||
                                    job.getJobDescription().toLowerCase().contains(keyword))
                            .collect(Collectors.toList());
                }
                // Apply pagination manually
                int start = Math.toIntExact(pageable.getOffset()); // ✅ safely converts long to int
                int end = Math.min((start + pageable.getPageSize()), allJobs.size());
                List<JobDetails> pagedJobs = allJobs.subList(start, end);

            Page<JobDetails> jobPage = new PageImpl<>(pagedJobs, pageable, allJobs.size());
           return new PageResponse((List<?>) jobPage.getContent(), jobPage.getNumber(), jobPage.getSize(), Math.toIntExact(jobPage.getTotalElements()));
        }

//    @Override
//    public CandidateListResponse getCandidateListByJobId(Long jobId) {
//        // Fetch job details
//        JobDetails jobDetails = jobDetailsRepository.findById(jobId)
//                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));
//        // Fetch candidates linked to this job
//        List<Candidate> candidates = candidateRepository.findByJobDetailsId(jobId);
//        // Map to DTOs
//        List<CandidateDto> candidateDtos = candidates.stream()
//                .map(candidate -> new CandidateDto(
//                        candidate.getMobileNo(),
//                        candidate.getFullName(),
//                        candidate.getEmail(),
//                        candidate.getLinkedInProfile(),
//                        candidate.getWebsite()
//                ))
//                .collect(Collectors.toList());
//        // Build response
//        return new CandidateListResponse(jobDetails.getId(), jobDetails.getJobTitle(), candidateDtos);
//    }

    @Override
    public CandidateListResponse getCandidateListByJobId(String jobId, Optional<Integer> pageNumber, Optional<Integer> pageSize, boolean isRecent, Optional<Integer> days, String sortFlag, Optional<String> search) {
            // Fetch job details
            JobDetails jobDetails = jobDetailsRepository.findByJobId(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));

            // Fetch all candidates for the job
            List<Candidate> candidates = candidateRepository.findByJobDetails_JobId(jobId);

            // Filter by recent (based on createdAt or postedDate)
            if (isRecent && days.isPresent()) {
                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.DAY_OF_YEAR, -days.get());
                Date thresholdDate = calendar.getTime();

                candidates = candidates.stream()
                        .filter(candidate -> candidate.getCreatedAt() != null &&
                                candidate.getCreatedAt().after(thresholdDate))
                        .collect(Collectors.toList());
            }

            // Filter by mobile number search
            if (search.isPresent()) {
                String keyword = search.get().trim();
                candidates = candidates.stream()
                        .filter(candidate -> candidate.getMobileNo() != null &&
                                candidate.getMobileNo().contains(keyword))
                        .collect(Collectors.toList());
            }

            // Apply pagination
            int page = pageNumber.orElse(0);
            int size = pageSize.orElse(10);
            int start = Math.toIntExact((long) page * size);
            int end = Math.min(start + size, candidates.size());
            List<Candidate> pagedCandidates = candidates.subList(start, end);
        if (start >= candidates.size()) {
            pagedCandidates = Collections.emptyList();
        } else {
            pagedCandidates = candidates.subList(start, end);
        }

            // Map to DTOs
            List<CandidateDto> candidateDtos = pagedCandidates.stream()
                    .map(candidate -> new CandidateDto(
                            candidate.getMobileNo(),
                            candidate.getFullName(),
                            candidate.getEmail(),
                            candidate.getLinkedInProfile(),
                            candidate.getWebsite()
                    ))
                    .collect(Collectors.toList());

            // Build response
            return new CandidateListResponse(jobDetails.getId(), jobDetails.getJobTitle(), candidateDtos);
        }


    @Override
    public String updateJobExpiryTime(String jobId, String days) {
        JobDetails job = jobDetailsRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        int daysToAdd = Integer.parseInt(days);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.DAY_OF_YEAR, daysToAdd);

        job.setClosingDayofJob(calendar.getTime());
        job.setUpdatedAt(new Date());
        jobDetailsRepository.save(job);

        return "Job expiry updated to: " + calendar.getTime();
    }

    @Override
    public String deleteTheJob(String jobId) {
        JobDetails job = jobDetailsRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));
        // Check if job is already expired
        if (job.getClosingDayofJob().before(new Date()) || job.getJobStatus() == JobStatus.CLOSED) {
            throw new RuntimeException("Job is already expired or closed. Cannot make as CLOSED.");
        }
        // Mark job as closed and update expiry date
        job.setClosingDayofJob(new Date());
        job.setJobStatus(JobStatus.CLOSED);

        jobDetailsRepository.save(job);
        return  job.getJobId() + job.getJobTitle() + " has been successfully marked as closed.";
    }

    @Override
    public byte[] generateAppliedCandidatesxls(String jobId) {
        List<DownloadCandidateResponse> downloadCandidateResponse = fetchCandiateList(jobId);
        List<String> headers =createHeaders();
        List<List<Object>> data = createObjectResponse(downloadCandidateResponse);
        String jobTitle = downloadCandidateResponse.isEmpty() ? "Unknown Job Title" : downloadCandidateResponse.get(0).getJobTitle();
        return excelReportGenerator.createExcelReport(headers, data, jobTitle, jobId);
    }


    private List<List<Object>> createObjectResponse(List<DownloadCandidateResponse> responses) {
        return responses.stream()
                .map(response -> Arrays.asList(
                        (Object) response.getCandidateName(), (Object) response.getMobile(), (Object) response.getEmail(), (Object) response.getJobTitle(),
                        (Object) response.getLinkedInProfile()
                ))
                .collect(Collectors.toList());
    }
    private List<String> createHeaders() {
        return Arrays.asList(ApplicationConstant.CANDIDATE_NAME, ApplicationConstant.MOBILE_NUMBER, ApplicationConstant.EMAIL_ID, ApplicationConstant.LOCATION, ApplicationConstant.JOB_TITLE, ApplicationConstant.LINKEDIN_PROFILE
        );
    }
    private List<DownloadCandidateResponse> fetchCandiateList(String jobId) {
        return candidateRepository.findCandidateListByJobId(jobId);
    }


    @Override
    public ResponseEntity<byte[]> downloadResume(String jobId) {
                try {
                    // Fetch resume data (e.g., from DB, file system, or cloud)
                    byte[] resumeData = fetchResumeData(jobId);
                    String fileName = "Candidate_Resume_" + jobId + ".pdf";

                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_PDF);
                    headers.setContentDisposition(ContentDisposition.builder("attachment").filename(fileName).build());
                    headers.setContentLength(resumeData.length);

                    return new ResponseEntity<>(resumeData, headers, HttpStatus.OK);
                } catch (Exception e) {
                    // Log error if needed
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
                }
            }

    @Override
    public JobDetailsResponse getJobDetailsById(String jobId) {

        JobDetails jobDetails = jobDetailsRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));

        JobDetailsResponse response = new JobDetailsResponse();

        response.setJobId(jobDetails.getJobId());
        response.setJobTitle(jobDetails.getJobTitle());
        response.setJobDescription(jobDetails.getJobDescription());
        response.setLocation(jobDetails.getLocation());

        // Convert String (DB) → List<String> (Response)
        if (jobDetails.getRolesAndResponsibilities() != null) {
            response.setRolesAndResponsibilities(
                    Arrays.asList(jobDetails.getRolesAndResponsibilities().split(","))
            );
        }

        if (jobDetails.getSkillsAndExperience() != null) {
            response.setSkillsAndExperience(
                    Arrays.asList(jobDetails.getSkillsAndExperience().split(","))
            );
        }
        return response;
    }

    private byte[] fetchResumeData(String jobId) {
                // Example logic: fetch from DB or file system
                Candidate resume = candidateRepository.findByJobDetailsJobId(jobId);
                if (resume == null || resume.getResume() == null) {
                    throw new RuntimeException("Resume not found for jobId: " + jobId);
                }
                return resume.getResume();// Assuming this returns byte[]
            }
}

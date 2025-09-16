package com.HZ.HireZentara.service.Impl;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.CandidateResponse;
import com.HZ.HireZentara.dto.request.JobDetailsRequest;
import com.HZ.HireZentara.dto.response.*;
import com.HZ.HireZentara.entity.Candidate;
import com.HZ.HireZentara.entity.JobDetails;
import com.HZ.HireZentara.enums.JobStatus;
import com.HZ.HireZentara.exceptions.JobExpiredException;
import com.HZ.HireZentara.repository.CandidateRepository;
import com.HZ.HireZentara.repository.JobDetailsRepository;
import com.HZ.HireZentara.service.JobDetailsService;
import com.HZ.HireZentara.utils.ApplicationDateTimeUtil;
import com.HZ.HireZentara.utils.CustomErrorCodeMessageUtils;
import com.HZ.HireZentara.utils.ExcelReportGenerator;
import com.HZ.HireZentara.utils.IDGenerator;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JobDetailsServiceImpl implements JobDetailsService {

     private final JobDetailsRepository jobDetailsRepository;
     private final ApplicationDateTimeUtil applicationDateTimeUtil;
     private final CandidateRepository candidateRepository;
     private final ExcelReportGenerator excelReportGenerator;
     private final CustomErrorCodeMessageUtils customCodeMessageUtils;


    public JobDetailsServiceImpl(JobDetailsRepository jobDetailsRepository, ApplicationDateTimeUtil applicationDateTimeUtil, CandidateRepository candidateRepository, ExcelReportGenerator excelReportGenerator, CustomErrorCodeMessageUtils customCodeMessageUtils) {
        this.jobDetailsRepository = jobDetailsRepository;
        this.applicationDateTimeUtil = applicationDateTimeUtil;
        this.candidateRepository = candidateRepository;
        this.excelReportGenerator = excelReportGenerator;
        this.customCodeMessageUtils = customCodeMessageUtils;
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
        jobResponse.setJobSatus(String.valueOf(jobDetails.getJobStatus()));

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
                List<JobDetails> allJobs = jobDetailsRepository.findAll(Sort.by("postedDate").descending());
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
                            .filter(job ->
                            String.valueOf(job.getJobId()).contains(keyword) ||  // search by jobId
                                    job.getJobTitle().toLowerCase().contains(keyword))// search by jobTitle
                            .collect(Collectors.toList());
                }
                // Apply pagination manually
                int start = Math.toIntExact(pageable.getOffset()); // ✅ safely converts long to int
                int end = Math.min((start + pageable.getPageSize()), allJobs.size());
               // List<JobDetails> pagedJobs = allJobs.subList(start, end);

        List<JobDetails> pagedJobs = (start <= end) ? allJobs.subList(start, end) : Collections.emptyList();
        int totalRecords = allJobs.size();
        int totalPages = (int) Math.ceil((double) totalRecords / size);
        return new PageResponse(pagedJobs, page, totalRecords, totalPages);
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
    public PageResponse getCandidateListByJobId(String jobId, Optional<Integer> pageNumber, Optional<Integer> pageSize, boolean isRecent, Optional<Integer> days, String sortFlag, Optional<String> search, String sortBy,List<String> candidateStatus) {
            // Fetch job details
            JobDetails jobDetails = jobDetailsRepository.findByJobId(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));

            // Fetch all candidates for the job
            List<Candidate> candidates = candidateRepository.findByJobDetails_JobId(jobId);

            // Filter by recent
            if (isRecent && days.isPresent()) {
                Calendar calendar = Calendar.getInstance();
                calendar.add(Calendar.DAY_OF_YEAR, -days.get());
                Date thresholdDate = calendar.getTime();

                candidates = candidates.stream()
                        .filter(candidate -> candidate.getCreatedAt() != null &&
                                candidate.getCreatedAt().after(thresholdDate))
                        .collect(Collectors.toList());
            }
        if (!candidateStatus.contains("ALL")) {
            candidates = candidates.stream()
                    .filter(candidate -> candidateStatus.contains(candidate.getCandidateStatus().name()))
                    .collect(Collectors.toList());
        }

            // Filter by search keyword
            if (search.isPresent()) {
                String keyword = search.get().trim();
                candidates = candidates.stream()
                        .filter(candidate -> candidate.getMobileNo() != null &&
                                candidate.getMobileNo().contains(keyword))
                        .collect(Collectors.toList());
            }

            // Pagination logic
            int page = pageNumber.orElse(0);
            int size = pageSize.orElse(10);
            int totalRecords = candidates.size();
            int totalPageCount = (int) Math.ceil((double) totalRecords / size);
            int start = page * size;
            int end = Math.min(start + size, totalRecords);

            List<Candidate> pagedCandidates = (start >= totalRecords)
                    ? Collections.emptyList()
                    : candidates.subList(start, end);

            // Map to DTOs
            List<CandidateResponse> candidateResponse = pagedCandidates.stream()
                    .map(candidate -> new CandidateResponse(
                            candidate.getFullName(),
                            candidate.getEmail(),
                            candidate.getCreatedAt(),
                            candidate.getCandidateStatus(),
                            candidate.getCurrentlocation(),
                            Base64.getEncoder().encodeToString(candidate.getResume()),
                            candidate.getMobileNo(),
                            candidate.getLinkedInProfile()
                    ))
                    .collect(Collectors.toList());

            // Return paginated response
            return new PageResponse(candidateResponse, page, totalRecords, totalPageCount);
        }


    @Override
    public String updateJobExpiryTime(String jobId, String days)   {
        JobDetails job = jobDetailsRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Date currentExpiry = job.getClosingDayofJob();

        // Check if job is already expired
        if (currentExpiry.before(new Date())) {
            throw new JobExpiredException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_1023,
                    customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_1023)));
        }
        int daysToAdd = Integer.parseInt(days);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(currentExpiry); // Use existing expiry date
        calendar.add(Calendar.DAY_OF_YEAR, daysToAdd);

        job.setClosingDayofJob(calendar.getTime());
        job.setUpdatedAt(new Date());
        jobDetailsRepository.save(job);

        return ApplicationConstant.JOB_EXPIRY_UPDATE_MESSAGE + calendar.getTime();
    }

    @Override
    public String deleteTheJob(String jobId) {
        JobDetails job = jobDetailsRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));
        // Check if job is already expired
        if (job.getClosingDayofJob().before(new Date()) || job.getJobStatus() == JobStatus.CLOSED) {
            throw new JobExpiredException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_1023,
                    customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_1023)));
        }
        // Mark job as closed and update expiry date
        job.setClosingDayofJob(new Date());
        job.setJobStatus(JobStatus.CLOSED);

        jobDetailsRepository.save(job);
        return  job.getJobId() + job.getJobTitle() + " has been successfully marked as closed.";
    }

    @Override
    public byte[] generateAppliedCandidatesxls(String jobId) {
        JobDetails job = jobDetailsRepository.findByJobId(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));
        List<DownloadCandidateResponse> downloadCandidateResponse = fetchCandiateList(jobId);
        List<String> headers =createHeaders();
        List<List<Object>> data = createObjectResponse(downloadCandidateResponse);
        String jobTitle = downloadCandidateResponse.isEmpty() ? "Unknown Job Title" : job.getJobTitle();
        return excelReportGenerator.createExcelReport(headers, data, jobTitle, jobId);
    }


    private List<List<Object>> createObjectResponse(List<DownloadCandidateResponse> responses) {
        return responses.stream()
                .map(response -> Arrays.asList(
                        (Object) response.getCandidateName(), (Object) response.getMobile(), (Object) response.getEmail(), response.getCurrentLocation(),(Object) response.getAppliedDate(),
                        (Object) response.getLinkedInProfile()
                ))
                .collect(Collectors.toList());
    }
    private List<String> createHeaders() {
        return Arrays.asList(ApplicationConstant.CANDIDATE_NAME, ApplicationConstant.MOBILE_NUMBER, ApplicationConstant.EMAIL_ID, ApplicationConstant.CURRENT_LOCATION, ApplicationConstant.APPLIED_DATE, ApplicationConstant.LINKEDIN_PROFILE
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

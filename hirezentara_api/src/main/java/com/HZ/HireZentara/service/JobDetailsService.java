package com.HZ.HireZentara.service;

import com.HZ.HireZentara.dto.request.JobDetailsRequest;
import com.HZ.HireZentara.dto.response.CandidateListResponse;
import com.HZ.HireZentara.dto.response.JobDetailsResponse;
import com.HZ.HireZentara.dto.response.JobResponse;
import com.HZ.HireZentara.dto.response.PageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface JobDetailsService {

    JobResponse createJob(JobDetailsRequest jobDetailsRequest);

    PageResponse getAllJobDetails(Optional<Integer> pageSize, Optional<Integer> pageNumber, boolean isRecent, Optional<Integer> days, List<String> jobStatus, String sortFlag, String sortBy, Optional<String> search);
    
    String updateJobExpiryTime(String jobId, String days);

    String deleteTheJob(String jobId);

    CandidateListResponse getCandidateListByJobId(String jobId, Optional<Integer> pageNumber, Optional<Integer> pageSize, boolean isRecent, Optional<Integer> days, String sortFlag, Optional<String> search);

    byte[] generateAppliedCandidatesxls(String jobId);

    ResponseEntity<byte[]> downloadResume(String jobId);

    JobDetailsResponse getJobDetailsById(String jobId);
}

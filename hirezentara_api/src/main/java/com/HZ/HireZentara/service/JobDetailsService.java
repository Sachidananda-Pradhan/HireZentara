package com.HZ.HireZentara.service;

import com.HZ.HireZentara.dto.request.JobDetailsRequest;
import com.HZ.HireZentara.dto.response.CandidateListResponse;
import com.HZ.HireZentara.dto.response.JobDetailsResponse;
import com.HZ.HireZentara.dto.response.PageResponse;
import com.HZ.HireZentara.entity.JobDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface JobDetailsService {

    JobDetails getJobDetailsById(Long jobId);

    JobDetailsResponse createJob(JobDetailsRequest jobDetailsRequest);

    PageResponse getAllJobDetails(Optional<Integer> pageSize, Optional<Integer> pageNumber, boolean isRecent, Optional<Integer> days, List<String> jobStatus, String sortFlag, String sortBy, Optional<String> search);
    
    String updateJobExpiryTime(Long jobId, String days);

    String deleteTheJob(Long jobId);

    CandidateListResponse getCandidateListByJobId(Long jobId, Optional<Integer> pageNumber, Optional<Integer> pageSize, boolean isRecent, Optional<Integer> days, String sortFlag, Optional<String> search);
}

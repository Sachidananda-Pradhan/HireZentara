package com.HZ.HireZentara.service;

import com.HZ.HireZentara.entity.JobDetails;
import org.springframework.stereotype.Service;

@Service
public interface JobDetailsService {

    JobDetails getJobDetailsById(Long jobId);
}

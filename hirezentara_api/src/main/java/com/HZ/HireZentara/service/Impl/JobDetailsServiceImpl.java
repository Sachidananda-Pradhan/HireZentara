package com.HZ.HireZentara.service.Impl;

import com.HZ.HireZentara.entity.JobDetails;
import com.HZ.HireZentara.repository.JobDetailsRepository;
import com.HZ.HireZentara.service.JobDetailsService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JobDetailsServiceImpl implements JobDetailsService {

     private  final JobDetailsRepository jobDetailsRepository;

    public JobDetailsServiceImpl(JobDetailsRepository jobDetailsRepository) {
        this.jobDetailsRepository = jobDetailsRepository;
    }

    @Override
    public JobDetails getJobDetailsById(Long jobId) {
        return jobDetailsRepository.findById(jobId).orElse(null);
    }
}

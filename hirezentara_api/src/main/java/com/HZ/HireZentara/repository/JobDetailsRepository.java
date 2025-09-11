package com.HZ.HireZentara.repository;

import com.HZ.HireZentara.entity.JobDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.Optional;


@Repository
public interface JobDetailsRepository extends JpaRepository<JobDetails ,Long> {

    Optional<JobDetails> findByJobId(String jobId);

}

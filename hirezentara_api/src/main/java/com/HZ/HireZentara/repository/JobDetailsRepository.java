package com.HZ.HireZentara.repository;

import com.HZ.HireZentara.entity.JobDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobDetailsRepository extends JpaRepository<JobDetails ,Long> {
}

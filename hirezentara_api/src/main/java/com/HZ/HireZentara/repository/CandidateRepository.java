package com.HZ.HireZentara.repository;

import com.HZ.HireZentara.dto.response.DownloadCandidateResponse;
import com.HZ.HireZentara.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

    Optional<Candidate> findByEmail(String email);

    Optional<Candidate> findByMobileNo(String mobileNo);



    // DTO projection
    @Query("SELECT new com.HZ.HireZentara.dto.response.DownloadCandidateResponse(" +
            "c.fullName, c.mobileNo, c.email,c.currentlocation, c.createdAt, c.linkedInProfile) " +
            "FROM Candidate c WHERE c.jobDetails.jobId = :jobId")
    List<DownloadCandidateResponse> findCandidateListByJobId(@Param("jobId") String jobId);


    List<Candidate> findByJobDetails_JobId(String jobId);

    Candidate findByJobDetailsJobId(String jobId);
}

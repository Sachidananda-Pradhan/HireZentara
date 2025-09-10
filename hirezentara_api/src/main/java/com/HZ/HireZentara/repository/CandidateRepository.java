package com.HZ.HireZentara.repository;

import com.HZ.HireZentara.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

    Optional<Candidate> findByEmail(String email);

    Optional<Candidate> findByMobileNo(String mobileNo);

    List<Candidate> findByJobDetailsId(Long jobId);
}

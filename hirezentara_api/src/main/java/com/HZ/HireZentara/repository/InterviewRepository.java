package com.HZ.HireZentara.repository;

import com.HZ.HireZentara.entity.InterviewDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository <InterviewDetails,Long >{


    List<InterviewDetails> findInterviewByCandidateId(long candidateId);
}

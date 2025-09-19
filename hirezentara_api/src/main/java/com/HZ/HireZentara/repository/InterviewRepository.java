package com.HZ.HireZentara.repository;

import com.HZ.HireZentara.entity.InterviewDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewRepository extends JpaRepository <InterviewDetails,Long >{
}

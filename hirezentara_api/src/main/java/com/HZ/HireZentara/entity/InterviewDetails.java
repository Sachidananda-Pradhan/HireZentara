package com.HZ.HireZentara.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
@Table( schema = "HIRE_ZENTARA", name = "INTERVIEW_DETAILS")
public class InterviewDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "interview_round", length = 50, nullable = false)
    private String interviewRound;

    @Column(name = "interview_date", length = 50, nullable = false)
    private Date interviewDate;

    @Column(name = "interview_time", length = 50, nullable = false)
    private String interviewStartTime;

    @Column(name = "interview_end_time", length = 50, nullable = false)
    private String interviewEndTime;

    @Column(name = "interviewer_name", length = 100, nullable = false)
    private String interviewerName;

    @Column(name = "interviewer_email", length = 100, nullable = false)
    private String interviewerEmail;

    @Column(name = "interview_mode", length = 50, nullable = false)
    private String interviewType;

    @Column(name = "interview_feedback", length = 500)
    private String interviewFeedback;

    @Column(name = "meeting_platform", length = 100)
    private String meetingPlatform;

    @ManyToOne(fetch = FetchType.LAZY) // ✅ InterviewDetails → Candidate (many-to-one)
    @JoinColumn(name = "candidate_id", nullable = false) // foreign key in InterviewDetails table
    private Candidate candidate;



}

package com.HZ.HireZentara.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table( schema = "HIRE_ZENTARA", name = "INTERVIEW_FEEDBACK")
public class InterviewFeedback extends  BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "feedback", length = 2000)
    private String feedback;

    @Column(name = "feedback_given_by", length = 100)
    private String feedbackGivenBy;


}

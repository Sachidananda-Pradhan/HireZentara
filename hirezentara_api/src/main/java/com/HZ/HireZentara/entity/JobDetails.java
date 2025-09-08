package com.HZ.HireZentara.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(schema = "HIRE_ZENTARA", name = "JOB_DETAILS")
public class JobDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "job_details_SEQ")
    @SequenceGenerator(sequenceName = "job_details", allocationSize = 1, name = "job_details_SEQ")
    private Long jobId;

    @Column(name = "job_title", length = 100, nullable = false)
    private String jobTitle;

    @Column(name = "job_description", length = 5000, nullable = false)
    private String jobDescription;

    @Column(name = "location", length = 255)
    private String location;

    private String employmentType;
    private String department;
    private String postedDate;
    private String applicationDeadline;
    private String requirements;
    private String responsibilities;
    private String salaryRange;
    private String companyName;
    private String companyWebsite;
    private String companyLogoUrl;
    private String jobStatus; // e.g., Open, Closed, On Hold
    private String recruiterName;
    private String recruiterEmail;
    private String recruiterPhoneNumber;




}

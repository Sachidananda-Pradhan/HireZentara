package com.HZ.HireZentara.entity;

import com.HZ.HireZentara.enums.JobStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(schema = "HIRE_ZENTARA", name = "JOB_DETAILS")
public class JobDetails extends  BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", length = 50, unique = true, nullable = false)
    private String jobId;

    @Column(name = "job_title", length = 100, nullable = false)
    private String jobTitle;

    @Column(name = "job_description", length = 5000, nullable = false)
    private String jobDescription;

    @Column(name = "location", length = 255)
    private String location;


    @Lob
    @Column(name = "roles_and_responsibilities", columnDefinition = "TEXT")
    private String rolesAndResponsibilities;

    @Lob
    @Column(name = "skills_and_experience", columnDefinition = "TEXT")
    private String skillsAndExperience;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_status", length = 20, nullable = false)
    private JobStatus jobStatus;

    @Column(name = "posted_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date postedDate;

    @Column(name = "closing_day_of_job", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date closingDayofJob;

    @Column(name = "job_link", length = 500)
    private String jobLink;

    @OneToMany(mappedBy = "jobDetails", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Candidate> candidates;

}

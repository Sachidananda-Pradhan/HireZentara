package com.HZ.HireZentara.entity;

import com.HZ.HireZentara.enums.CandidateStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

import java.io.File;

@Entity
@Data
@Table( schema = "HIRE_ZENTARA", name = "CANDIDATE")
public class Candidate extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "first_name", length = 50, nullable = false)
    private String firstName;

    @NotNull
    @Column(name = "last_name", length = 50, nullable = false)
    private String lastName;

    @NotNull
    @Column(name = "full_name", length = 100, nullable = false)
    private String fullName;

    @NotNull
    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @NotNull
    @Column(name = "re_enter_email", length = 100, nullable = false)
    private String reEnterEmail;

    @NotNull
    @Column(name = "mobile_no", length = 20, nullable = false, unique = true)
    private String mobileNo;

    @Column(name = "current_location", length = 255)
    private String currentlocation;

    @Column(name = "linkedin_profile", length = 255)
    private String linkedInProfile;

    @Column(name = "website", length = 255)
    private String website;

    @Enumerated(EnumType.STRING)
    @Column(name = "candidate_status", length = 50, nullable = false)
    private CandidateStatus candidateStatus;

    @ManyToOne(fetch = FetchType.LAZY) // ✅ Candidate → JobDetails (many-to-one)
    @JoinColumn(name = "job_details_id", nullable = false) // foreign key in Candidate table
    @JsonIgnore
    private JobDetails jobDetails;

    @Lob
    @Column(name = "resume", nullable = false)
    private byte[] resume;

}

package com.HZ.HireZentara.entity;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.processing.Pattern;

@Entity
@Data
@Table(name = "candidate_registration" ,S)
public class CandidateRegistration  extends CommonEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private int id;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    private String email;

    @NotNull
    private String reEnterEmail;

    @NotNull
    @Pattern(ApplictionConstant.REGEXP, message = "Mobile number must be 10 digits")
    private String mobileNo;

    private String linkedInProfile;

    private String website;
}

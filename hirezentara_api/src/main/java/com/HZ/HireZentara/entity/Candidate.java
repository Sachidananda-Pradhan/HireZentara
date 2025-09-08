package com.HZ.HireZentara.entity;

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
    private String mobileNo;

    private String linkedInProfile;

    private String website;

    @Lob
    private byte[] resume;
}

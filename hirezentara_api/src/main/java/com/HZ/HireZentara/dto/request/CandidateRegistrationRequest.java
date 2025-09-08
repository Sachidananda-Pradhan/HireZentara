package com.HZ.HireZentara.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CandidateRegistrationRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String reEnterEmail;
    private String mobileNo;
    private String linkedInProfile;
    private String country;
    private String website;

}

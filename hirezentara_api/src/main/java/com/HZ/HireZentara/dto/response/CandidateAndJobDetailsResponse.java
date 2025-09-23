package com.HZ.HireZentara.dto.response;

import com.HZ.HireZentara.enums.CandidateStatus;
import lombok.Data;

import java.util.Date;

@Data
public class CandidateAndJobDetailsResponse {
    private  long candidateId;
    private String name;
    private String email;
    private Date appliedDate;
    private CandidateStatus candidateStatus;
    private String currentLocation;
    private String resume;
    private String mobileNo;
    private String linkedInProfile;
    private String jobTitle;
    private String experience;
    private String expectedSalary;
    private String availabilityNoticePeriod;
}

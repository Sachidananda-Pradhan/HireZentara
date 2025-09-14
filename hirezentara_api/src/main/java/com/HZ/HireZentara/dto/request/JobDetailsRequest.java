package com.HZ.HireZentara.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class JobDetailsRequest {

    private String jobTitle;
    private String jobDescription;
    private String location;
    private List<String> rolesAndResponsibilities;
    private List<String> skillsAndExperience;
    private String expiringDayOfJob;

}

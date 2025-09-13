package com.HZ.HireZentara.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class JobDetailsResponse {

    private String jobId;
    private String jobTitle;
    private String jobDescription;
    private String location;
    private List<String> rolesAndResponsibilities;
    private List<String> skillsAndExperience;


}

package com.HZ.HireZentara.dto;


import com.HZ.HireZentara.enums.CandidateStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateResponse {

    private String name;
    private String email;
    private Date   appliedDate;
    private CandidateStatus CandidateStatus;
    private String currentLocation;
    private String resume;
    private String mobileNo;
    private String linkedInProfile;


}

package com.HZ.HireZentara.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DownloadCandidateResponse {

    private  String candidateName ;
    private  String mobile;
    private  String email;
    private  String currentLocation;
    private  Date appliedDate;
    private  String linkedInProfile;

}

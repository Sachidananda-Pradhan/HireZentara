package com.HZ.HireZentara.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DownloadCandiateResponse {

    private  String candidateName ;
    private  String location;
    private  String mobile;
    private  String email;
    private  String jobTitle;
    private  String linkedInProfile;

}

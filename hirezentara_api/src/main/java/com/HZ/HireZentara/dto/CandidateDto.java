package com.HZ.HireZentara.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateDto {

    private String name;
    private String email;
    private String resume;
    private String mobileNo;
    private String linkedInProfile;


}

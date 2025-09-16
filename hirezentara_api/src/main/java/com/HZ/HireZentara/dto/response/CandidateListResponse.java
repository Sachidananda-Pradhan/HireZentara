package com.HZ.HireZentara.dto.response;


import com.HZ.HireZentara.dto.CandidateResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateListResponse {
    private Long jobId;
    private String jobTitle;
    private List<CandidateResponse> candidates;

}

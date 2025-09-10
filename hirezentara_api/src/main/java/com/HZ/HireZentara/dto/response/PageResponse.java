package com.HZ.HireZentara.dto.response;

import com.HZ.HireZentara.entity.JobDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse {
    private List<?> data;
    private int currentPageNumber;
    private int totalRecords;
    private int totalPageCount;


}

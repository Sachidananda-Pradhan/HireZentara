package com.HZ.HireZentara.dto.response;

import lombok.Data;


@Data
public class StatusResponse {

	private String status;  // SUCCESS // FAILURE

    public StatusResponse(String status) {
        this.status = status;
    }
}

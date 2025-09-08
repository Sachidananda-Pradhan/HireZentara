package com.HZ.HireZentara.dto.response;

import com.HZ.HireZentara.dto.exception.ErrorDetails;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class APIResponse {
	private String status;  // SUCCESS // FAILURE
	private int statusCode; // STATUS CODE 200, 400, 401 , 500 etc
	private String encryptedResponseData; // encrypted data in case of 200 response.
	private ErrorDetails error; // error object with out encryption needs to be send.

    public APIResponse(String status, int statusCode, String encryptedResponseData, ErrorDetails error) {
        this.status = status;
        this.statusCode = statusCode;
        this.encryptedResponseData = encryptedResponseData;
        this.error = error;
    }
}

package com.HZ.HireZentara.dto.request;


import jakarta.validation.constraints.NotEmpty;
import lombok.Data;


@Data
public class APIRequest {
	@NotEmpty(message = "encryptedRequestData Should not be empty/null")
	private String encryptedRequestData;
}

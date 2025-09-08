package com.HZ.HireZentara.exceptions;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class InvalidEncryptedTokenException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	private final HttpStatus httpStatus;
	private int statusCode;
	private String errorMessage;

	public InvalidEncryptedTokenException(HttpStatus httpStatus, int statusCode, String errorMessage) {
		super(errorMessage);
		this.httpStatus = httpStatus;
		this.statusCode = statusCode;
		this.errorMessage = errorMessage;
	}
}

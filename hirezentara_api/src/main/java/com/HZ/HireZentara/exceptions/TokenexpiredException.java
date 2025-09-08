package com.HZ.HireZentara.exceptions;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class TokenexpiredException extends RuntimeException{
	private static final long serialVersionUID = 1L;
	private final HttpStatus httpStatus;
	private int statusCode;
	private String errorMessage;

	public TokenexpiredException(HttpStatus httpStatus, int statusCode, String errorMessage) {
		super(errorMessage);
		this.httpStatus = httpStatus;
		this.statusCode = statusCode;
		this.errorMessage = errorMessage;
	}
}

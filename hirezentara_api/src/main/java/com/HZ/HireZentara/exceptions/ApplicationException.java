package com.HZ.HireZentara.exceptions;


import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class ApplicationException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	private HttpStatus httpStatus;
	private int statusCode;
	private String errorMessage;

	public ApplicationException(HttpStatus httpStatus, int statusCode, String errorMessage) {
		super(errorMessage);
		this.httpStatus = httpStatus;
		this.statusCode = statusCode;
		this.errorMessage = errorMessage;
	}

}

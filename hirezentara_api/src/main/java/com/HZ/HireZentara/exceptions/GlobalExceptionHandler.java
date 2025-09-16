package com.HZ.HireZentara.exceptions;

import com.HZ.HireZentara.dto.response.APIResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private final ExceptionResponseGenerator responseGenerator = new ExceptionResponseGenerator();

    @ExceptionHandler(ApplicationException.class)
    public ResponseEntity<APIResponse> handleApplicationException(ApplicationException ex) {
        log.error("ApplicationException caught: {}", ex.getMessage());
        APIResponse response = responseGenerator.customErrorResponse(ex.getStatusCode(), ex.getErrorMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(CandidateExistsException.class)
    public ResponseEntity<APIResponse> handleCandidateExistsException(CandidateExistsException ex) {
        log.error("CandidateExistsException caught: {}", ex.getMessage());
        APIResponse response = responseGenerator.customErrorResponse(ex.getStatusCode(), ex.getErrorMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(InvalidEncryptedTokenException.class)
    public ResponseEntity<APIResponse> handleInvalidEncryptedTokenException(InvalidEncryptedTokenException ex) {
        log.error("InvalidEncryptedTokenException caught: {}", ex.getMessage());
        APIResponse response = responseGenerator.customErrorResponse(ex.getStatusCode(), ex.getErrorMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(InvalidSessionIdException.class)
    public ResponseEntity<APIResponse> handleInvalidSessionIdException(InvalidSessionIdException ex) {
        log.error("InvalidSessionIdException caught: {}", ex.getMessage());
        APIResponse response = responseGenerator.customErrorResponse(ex.getStatusCode(), ex.getErrorMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(SessionIdexpiredException.class)
    public ResponseEntity<APIResponse> handleSessionIdExpiredException(SessionIdexpiredException ex) {
        log.error("SessionIdexpiredException caught: {}", ex.getMessage());
        APIResponse response = responseGenerator.customErrorResponse(ex.getStatusCode(), ex.getErrorMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(TokenexpiredException.class)
    public ResponseEntity<APIResponse> handleTokenExpiredException(TokenexpiredException ex) {
        log.error("TokenexpiredException caught: {}", ex.getMessage());
        APIResponse response = responseGenerator.customErrorResponse(ex.getStatusCode(), ex.getErrorMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    @ExceptionHandler(JobExpiredException.class)
    public ResponseEntity<APIResponse> handleJobExpiredException(JobExpiredException ex) {
        log.error("JobExpiredException caught: {}", ex.getMessage());
        APIResponse response = responseGenerator.customErrorResponse(ex.getStatusCode(), ex.getErrorMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(UnAuthneticatedException.class)
    public ResponseEntity<APIResponse> handleUnAuthenticatedException(UnAuthneticatedException ex) {
        log.error("UnAuthneticatedException caught: {}", ex.getMessage());
        APIResponse response = responseGenerator.customErrorResponse(ex.getStatusCode(), ex.getErrorMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse> handleGenericException(Exception ex) {
        log.error("Unhandled exception caught: {}", ex.getMessage(), ex);
        APIResponse response = responseGenerator.failedToProcessResponse();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}

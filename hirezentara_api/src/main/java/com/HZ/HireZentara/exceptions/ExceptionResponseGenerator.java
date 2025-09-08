package com.HZ.HireZentara.exceptions;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.exception.ErrorDetails;
import com.HZ.HireZentara.dto.response.APIResponse;
import org.springframework.stereotype.Service;

@Service
public class ExceptionResponseGenerator  {

    public APIResponse failedToProcessResponse()
    {
        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setCode(100);
        errorDetails.setMessage("Failed to process request");
        return new APIResponse(ApplicationConstant.FAILED, ApplicationConstant.FAILURE_400, null, errorDetails);
    }

    public APIResponse customErrorResponse(int code, String message)
    {
        ErrorDetails errorDetails = new ErrorDetails();
        errorDetails.setCode(code);
        errorDetails.setMessage(message);
        return new APIResponse(ApplicationConstant.FAILED, ApplicationConstant.FAILURE_400, null, errorDetails);
    }

}

package com.HZ.HireZentara.dto.Admin.request;

import com.HZ.HireZentara.constant.ApplicationConstant;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class LoginRequest {

    @NotEmpty(message = "User name should be null/empty")
    private String userName;

    @NotEmpty(message = "Password should be null/empty")
    @Size(min = 8,max = 64,message = "Please enter a min 8 and max = 64 character password")
    @Pattern(regexp = ApplicationConstant.ADMIN_PWD_REG_EXP,message = "Password must contain only allowed characters")
    private String password;

    @NotEmpty(message = "Captcha should be null/empty")
    @Size(max = 6,message = "Please enter a 6 character captcha")
    @Pattern(regexp = ApplicationConstant.ALPHA_NUMERIC_REQ_EXP, message = "Captcha should contain either alpha or alphanumeric characters.")
    private String captcha;
}

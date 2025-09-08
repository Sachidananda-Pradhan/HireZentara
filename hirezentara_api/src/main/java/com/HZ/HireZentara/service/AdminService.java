package com.HZ.HireZentara.service;

import com.HZ.HireZentara.dto.Admin.request.LoginRequest;
import com.HZ.HireZentara.dto.Admin.response.AdminUserDetailsResponse;
import com.HZ.HireZentara.dto.Admin.response.CaptchaResponse;
import com.HZ.HireZentara.dto.Admin.response.LoginResponse;
import com.HZ.HireZentara.dto.response.StatusResponse;
import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.ClientSession;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.stereotype.Service;

@Service
public interface AdminService {

    LoginResponse login(LoginRequest loginRequest, HttpServletRequest httpRequest, Client client);

    CaptchaResponse generateCaptcha(HttpServletRequest httpRequest);

    StatusResponse logout(ClientSession clientSession);

    AdminUserDetailsResponse getAdminUserDetails( String userName);
}

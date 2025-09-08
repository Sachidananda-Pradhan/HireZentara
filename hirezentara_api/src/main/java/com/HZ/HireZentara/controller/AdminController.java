package com.HZ.HireZentara.controller;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.Admin.request.LoginRequest;
import com.HZ.HireZentara.dto.Admin.response.AdminUserDetailsResponse;
import com.HZ.HireZentara.dto.Admin.response.CaptchaResponse;
import com.HZ.HireZentara.dto.Admin.response.LoginResponse;
import com.HZ.HireZentara.dto.request.APIRequest;
import com.HZ.HireZentara.dto.response.APIResponse;
import com.HZ.HireZentara.dto.response.StatusResponse;
import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.ClientSession;
import com.HZ.HireZentara.exceptions.ExceptionResponseGenerator;
import com.HZ.HireZentara.repository.ClientSessionRepository;
import com.HZ.HireZentara.service.AdminService;
import com.HZ.HireZentara.service.IClientAPISerretService;
import com.HZ.HireZentara.utils.APIResponseUtils;
import com.HZ.HireZentara.utils.CustomErrorCodeMessageUtils;
import com.HZ.HireZentara.utils.PortalAPIEncodeDecodeUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/admin")
public class AdminController  extends BaseController {

    private  final AdminService adminService;
    private  final ExceptionResponseGenerator exceptionResponseGenerator;
    private  final APIResponseUtils apiResponseUtils;
    private  final PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils;
    private  final CustomErrorCodeMessageUtils customErrorCodeMessageUtils;

    public AdminController(AdminService adminService,
                           IClientAPISerretService clientDetailsService,
                           ClientSessionRepository clientSessionRepository,ExceptionResponseGenerator exceptionResponseGenerator, APIResponseUtils apiResponseUtils, PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils, CustomErrorCodeMessageUtils customErrorCodeMessageUtils) {
        super( clientDetailsService, clientSessionRepository,customErrorCodeMessageUtils);
        this.adminService = adminService;
        this.exceptionResponseGenerator = exceptionResponseGenerator;
        this.apiResponseUtils = apiResponseUtils;
        this.portalAPIEncodeDecodeUtils = portalAPIEncodeDecodeUtils;
        this.customErrorCodeMessageUtils = customErrorCodeMessageUtils;
    }

    @PostMapping("/login")
    public APIResponse adminLogin(HttpServletRequest httpRequest, @Valid @RequestBody APIRequest apiRequest) {
        Client client = validateAuthorization(httpRequest, ApplicationConstant.ADMIN);
        try {
            Object object = portalAPIEncodeDecodeUtils.decryptObject(apiRequest, LoginRequest.class);
            if (object instanceof LoginRequest) {
                LoginRequest loginRequest = (LoginRequest) object;
                LoginResponse loginResponse = adminService.login(loginRequest, httpRequest, client);
                return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, loginResponse, null);
            } else {
                log.error("login :: Invalid request");
                return exceptionResponseGenerator.customErrorResponse(1, ApplicationConstant.INVALID_REQUEST);
            }
        } catch (JsonProcessingException e) {
            log.error("login :: Failed to process request : {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }

    @GetMapping("/generate/captcha")
    public APIResponse generateCaptcha(HttpServletRequest httpRequest) throws IOException {
        validateAuthorization(httpRequest, ApplicationConstant.ADMIN);
        CaptchaResponse captchaResponse =  adminService.generateCaptcha(httpRequest);
        return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, captchaResponse, null);
    }

    @GetMapping("/logged_admin_users_Details")
    public APIResponse getLoggedAdminUsersDetails(HttpServletRequest httpRequest, @RequestParam  String userName) {
        validateSessionId(httpRequest);
        AdminUserDetailsResponse adminUserDetailsResponse = adminService.getAdminUserDetails(userName);
        return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, adminUserDetailsResponse, null);
    }

    @PostMapping("/admin-logout")
    public APIResponse getLogOut(HttpServletRequest httpRequest) {
        log.info("======= Logout from  Admin page =======");
        ClientSession clientSession = validateSessionId(httpRequest);
        StatusResponse response = adminService.logout(clientSession);
        return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, response, null);
    }

}

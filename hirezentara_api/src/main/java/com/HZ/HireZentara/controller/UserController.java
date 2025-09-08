package com.HZ.HireZentara.controller;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.response.APIResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.HZ.HireZentara.dto.exception.ErrorDetails;
import com.HZ.HireZentara.dto.request.APIRequest;
import com.HZ.HireZentara.entity.Users;
import com.HZ.HireZentara.service.IUserService;
import com.HZ.HireZentara.utils.APIResponseUtils;
import com.HZ.HireZentara.utils.PortalAPIEncodeDecodeUtils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

	private final IUserService userService;
	private final APIResponseUtils apiResponseUtils;
	private final PortalAPIEncodeDecodeUtils encodeDecodeUtils;

	public UserController(IUserService userService, APIResponseUtils apiResponseUtils,
			PortalAPIEncodeDecodeUtils encodeDecodeUtils) {
		this.userService = userService;
		this.apiResponseUtils = apiResponseUtils;
		this.encodeDecodeUtils = encodeDecodeUtils;
	}

	@PostMapping("/createUser")
	public APIResponse createUser(@RequestBody APIRequest apiRequest) throws JsonMappingException, JsonProcessingException {

		Object object = encodeDecodeUtils.decryptObject(apiRequest, Users.class);

		if (object instanceof Users) {
			Users users = userService.createUser((Users) object);
			return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
					ApplicationConstant.SUCCESS_200, users, null);
		} else {
			log.info("Request does not contains users details");
			ErrorDetails errorDetails = new ErrorDetails();
			errorDetails.setCode(1);
			errorDetails.setMessage("Request does not contains users details");
			return new APIResponse(ApplicationConstant.FAILED, ApplicationConstant.FAILURE_400, null, errorDetails);
		}
	}

	@GetMapping("/getAllUsers")
	public  APIResponse getAllUsers() {
		return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
				ApplicationConstant.SUCCESS_200, userService.getAllUsers(), null);
	}

	@GetMapping("/account-encrypt")
	public String accountEncrypt(@RequestParam String data) {
		String encodedData = encodeDecodeUtils.encryptBE(data);
		return encodedData;
	}
}

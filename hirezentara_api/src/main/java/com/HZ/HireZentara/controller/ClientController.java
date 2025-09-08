package com.HZ.HireZentara.controller;

import java.util.List;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.response.APIResponse;
import com.HZ.HireZentara.service.IClientService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.ClientAPISecret;
import com.HZ.HireZentara.service.IClientAPISerretService;
import com.HZ.HireZentara.utils.APIResponseUtils;
import com.HZ.HireZentara.utils.PortalAPIEncodeDecodeUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/v1/client")
public class ClientController {
	
	private IClientService clientService;
	private final IClientAPISerretService clientAPISecretService;
	private final APIResponseUtils apiResponseUtils;

	public ClientController(IClientAPISerretService clientDetailService, APIResponseUtils apiResponseUtils,
			PortalAPIEncodeDecodeUtils encodeDecodeUtils, IClientService clientService) {
		this.clientAPISecretService = clientDetailService;
		this.apiResponseUtils = apiResponseUtils;
		this.clientService=clientService;
	}

	@PostMapping("/create")
	public APIResponse createClientDetails(@RequestBody Client client) throws JsonMappingException, JsonProcessingException {
			ClientAPISecret clientDetails= clientService.saveClient(client);
			return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, clientDetails, null);
	}

	@GetMapping("/getAllClients")
	public APIResponse getAllClientCredentials() {
		List<ClientAPISecret> clientDetails = clientAPISecretService.getAllClientCredentials();
		return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, clientDetails, null);
	}
}

package com.HZ.HireZentara.utils;

import com.HZ.HireZentara.dto.response.APIResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.HZ.HireZentara.dto.exception.ErrorDetails;


import org.springframework.stereotype.Service;

@Service
public class APIResponseUtils {


	private final PortalAPIEncodeDecodeUtils encodeDecodeUtil;


	private final ObjectMapper objectMapper;


	public APIResponseUtils(PortalAPIEncodeDecodeUtils encodeDecodeUtil,ObjectMapper objectMapper) {
		this.encodeDecodeUtil = encodeDecodeUtil;
		this.objectMapper=objectMapper;
	}

	public APIResponse generateExternalApiResponse(String status, int statusCode, Object data, ErrorDetails error) {

		if (data != null) {
			String dataStr = encodeDecodeUtil.encryptBE(data);
			return new APIResponse(status, statusCode, dataStr, error);
		} else {
			return new APIResponse(status, statusCode, null, error);
		}
	}

}

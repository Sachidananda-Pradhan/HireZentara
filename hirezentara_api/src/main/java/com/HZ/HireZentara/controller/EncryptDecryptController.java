package com.HZ.HireZentara.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.HZ.HireZentara.dto.request.DecryptRequest;
import com.HZ.HireZentara.dto.request.EncryptRequest;
import com.HZ.HireZentara.utils.PortalAPIEncodeDecodeUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/secure")
@Slf4j
public class EncryptDecryptController {

	private PortalAPIEncodeDecodeUtils encodeDecodeUtils;

	public EncryptDecryptController(PortalAPIEncodeDecodeUtils encodeDecodeUtils) {
		this.encodeDecodeUtils = encodeDecodeUtils;
	}

	@PostMapping("/encryptRequest")
	public String encrypt(@RequestBody EncryptRequest jsonDataStr) {
		Object object = null;
		try {
			String jsonString = jsonDataStr.getEncryptedRequestData();
			log.info("jsonString " + jsonString);
			object = new ObjectMapper().readValue(jsonString, Object.class);
			return encodeDecodeUtils.encryptBE(object);
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
	}

	@PostMapping("/decryptRequest")
	public String decrypt(@RequestBody DecryptRequest jsonData) {
		String response = encodeDecodeUtils.decryptBE(jsonData.getEncryptedResponseData());
		log.info("response " + response);
		return response;
	}
//
//	@PostMapping("/encrypt")
//	public HttpResponse<String> encrypt(@RequestBody String plaintext) {
//		String encryptedText = dynamicIVEncryptDecrypt.encrypt(plaintext);
//		log.info("Encrypted Text: " + encryptedText);
//		return HttpResponse.ok(encryptedText).contentType(MediaType.TEXT_PLAIN);
//	}
//
//	@Post("/decrypt")
//	public HttpResponse<String> decrypt(@Body String encryptedPayload) {
//
//		String decryptedPayload = dynamicIVEncryptDecrypt.decrypt(encryptedPayload);
//		log.info("Decrypted Payload: " + decryptedPayload);
//		return HttpResponse.ok(decryptedPayload).contentType(MediaType.TEXT_PLAIN);
//	}
}

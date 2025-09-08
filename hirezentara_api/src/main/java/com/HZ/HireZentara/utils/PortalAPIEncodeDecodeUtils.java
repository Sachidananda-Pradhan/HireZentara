package com.HZ.HireZentara.utils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.HZ.HireZentara.dto.request.APIRequest;
import com.HZ.HireZentara.exceptions.ApplicationException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PortalAPIEncodeDecodeUtils {

	private  final ApplicationEnviornmentVariablesUtils applicationEnvVariables;

	public PortalAPIEncodeDecodeUtils(ApplicationEnviornmentVariablesUtils applicationEnvVariables) {
		this.applicationEnvVariables = applicationEnvVariables;
	}

	private IvParameterSpec getIvParameterSpec(String iv) {
		IvParameterSpec ivSpec = new IvParameterSpec(iv.getBytes(StandardCharsets.UTF_8));
		return ivSpec;
	}

	public String encrypt(Object dataObject, String algo, String key, String aesStr, String encStr, String iv) {
		try {
			Cipher cipher = Cipher.getInstance(algo);
			int blockSize = cipher.getBlockSize();

			if (dataObject == null) {
				log.error("===== encrypt req =====");
				log.error(ApplicationConstant.INPUT_OBJECT_CAN_NOT_BE_NULL);
				throw new ApplicationException(HttpStatus.INTERNAL_SERVER_ERROR, 500,
						ApplicationConstant.INPUT_OBJECT_CAN_NOT_BE_NULL);
			}

			byte[] dataBytes = new ObjectMapper().writeValueAsBytes(dataObject);
			int plaintextLength = dataBytes.length;
			if (plaintextLength % blockSize != 0) {
				plaintextLength = plaintextLength + (blockSize - (plaintextLength % blockSize));
			}

			byte[] plaintext = new byte[plaintextLength];
			System.arraycopy(dataBytes, 0, plaintext, 0, dataBytes.length);

			SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(), aesStr);
			IvParameterSpec ivSpec = getIvParameterSpec(iv);

			cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
			byte[] encrypted = cipher.doFinal(plaintext);

			return Base64.getEncoder().encodeToString(encrypted); //.replaceAll(encStr, ApplicationConstants.EMPTY_STRING);

		} catch (Exception e) {
			log.info("encrypt :: Exception occur : {}", e.getMessage());
			throw new ApplicationException(HttpStatus.INTERNAL_SERVER_ERROR, 500, e.getMessage());
		}
	}

	/**
	 * @param data
	 * @return this is do decrypt crypto algorithm process and response decrpted
	 *         formate
	 */
	public String decrypt(String data, String key, String algo, String aesStr, String iv) {
		try {

			//byte[] DecodedData = Base64.getDecoder().decode(clearCharFromString(data));

			byte[] DecodedData = Base64.getDecoder().decode(data);
			Cipher cipher = Cipher.getInstance(algo);
			SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(), aesStr);
			IvParameterSpec ivSpec = getIvParameterSpec(iv);

			cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);

			byte[] original = cipher.doFinal(DecodedData);
			String originalString = new String(original);
			return originalString.trim();
		} catch (Exception e) {
			log.error("decrypt :: Exception occur : {}", e.getMessage());
			throw new ApplicationException(HttpStatus.INTERNAL_SERVER_ERROR, 500,
					"Failed to decrypt the provided input.");
		}
	}

	public String decryptBE(String encryptedRequestData) {
		return decrypt(encryptedRequestData, applicationEnvVariables.getApiKey(),
				applicationEnvVariables.getEncodingAlgo(), applicationEnvVariables.getAesStr(),
				applicationEnvVariables.getApiIV())
				.replaceAll(applicationEnvVariables.getEncoderStr(), ApplicationConstant.EMPTY_STRING);
	}

	public Object decryptObject(APIRequest encryptedRequestData, Class<?> classType)
			throws JsonMappingException, JsonProcessingException {

		if (encryptedRequestData != null && (encryptedRequestData.getEncryptedRequestData()) != null
				|| !encryptedRequestData.getEncryptedRequestData().isEmpty()) {
			String decryptedString = decrypt(encryptedRequestData.getEncryptedRequestData(),
					applicationEnvVariables.getApiKey(), applicationEnvVariables.getEncodingAlgo(),
					applicationEnvVariables.getAesStr(), applicationEnvVariables.getApiIV());
			
			log.info("===== decryptObject :: decryptedString {}=====",decryptedString);

			return new ObjectMapper().readValue(decryptedString, classType);
		} else {
			throw new ApplicationException(HttpStatus.INTERNAL_SERVER_ERROR, 500,
					"Provided input is either null or empty");
		}

	}

	public String encryptBE(Object requestData) {
		return encrypt(requestData, applicationEnvVariables.getEncodingAlgo(), applicationEnvVariables.getApiKey(),
				applicationEnvVariables.getAesStr(), applicationEnvVariables.getEncoderStr(),
				applicationEnvVariables.getApiIV());
	}
	
	
	public String generatePageEncryptedToken(String encryptedSession, Date timeStamp) {
		try {

			// String secretKey = ApplicationEnviornmentVariablesUtils.API_KEY;
			String secretKey2 = applicationEnvVariables.getApiKey();
			Cipher cipher = Cipher.getInstance("AES");
			SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey2.getBytes(StandardCharsets.UTF_8), "AES");

			cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);

			byte[] sessionBytes = encryptedSession.getBytes("UTF-8");
			byte[] timeStampBytes = timeStamp.toString().getBytes("UTF-8");
			byte[] encryptedSession1 = cipher.doFinal(sessionBytes);
			byte[] encryptedTimeStamp = cipher.doFinal(timeStampBytes);

			byte[] combinedData = new byte[encryptedSession1.length + encryptedTimeStamp.length];
			System.arraycopy(encryptedSession1, 0, combinedData, 0, encryptedSession1.length);
			System.arraycopy(encryptedTimeStamp, 0, combinedData, encryptedSession1.length, encryptedTimeStamp.length);

			String encryptedToken = Base64.getEncoder().encodeToString(combinedData);

			return encryptedToken;
		} catch (Exception e) {
			return null;
		}

	}

	public String generateEncryptedSessionId(String session, Date timeStamp) {
		try {
			String secretKey2 = applicationEnvVariables.getApiKey();
			Cipher cipher = Cipher.getInstance("AES");
			SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey2.getBytes(StandardCharsets.UTF_8), "AES");

			cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);

			byte[] sessionBytes = session.getBytes("UTF-8");
			byte[] timeStampBytes = timeStamp.toString().getBytes("UTF-8");
			byte[] encryptedSession = cipher.doFinal(sessionBytes);
			byte[] encryptedTimeStamp = cipher.doFinal(timeStampBytes);


			byte[] combinedData = new byte[encryptedSession.length + encryptedTimeStamp.length];
			System.arraycopy(encryptedSession, 0, combinedData, 0, encryptedSession.length);
			System.arraycopy(encryptedTimeStamp, 0, combinedData, encryptedSession.length, encryptedTimeStamp.length);
			
		String encryptedSessionId = Base64.getEncoder().encodeToString(combinedData);
		return encryptedSessionId;
		} catch (Exception e) {
			log.error("Error occurred while generating encrypted session ID", e);
	        return "Error occurred while generating encrypted session ID";
		}
	}
}

package com.HZ.HireZentara.controller;

import java.net.http.HttpRequest;
import java.util.Base64;
import java.util.Date;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.ClientAPISecret;
import com.HZ.HireZentara.entity.ClientSession;
import com.HZ.HireZentara.enums.ClientType;
import com.HZ.HireZentara.exceptions.InvalidEncryptedTokenException;
import com.HZ.HireZentara.exceptions.InvalidSessionIdException;
import com.HZ.HireZentara.exceptions.SessionIdexpiredException;
import com.HZ.HireZentara.exceptions.TokenexpiredException;
import com.HZ.HireZentara.exceptions.UnAuthneticatedException;
import com.HZ.HireZentara.repository.ClientSessionRepository;
import com.HZ.HireZentara.service.IClientAPISerretService;
import com.HZ.HireZentara.utils.CustomErrorCodeMessageUtils;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Slf4j
public class BaseController {

	private final IClientAPISerretService clientDetailsService;
	private final ClientSessionRepository clientSessionRepository;
	private final CustomErrorCodeMessageUtils customCodeMessageUtils;


	public BaseController(IClientAPISerretService clientDetailsService,
						  ClientSessionRepository clientSessionRepository, CustomErrorCodeMessageUtils customCodeMessageUtils) {
		this.clientDetailsService = clientDetailsService;
		this.clientSessionRepository=clientSessionRepository;
		this.customCodeMessageUtils=customCodeMessageUtils;
	}


//	public boolean validateCMSAuthorization(HttpRequest request, String clientName) {
//                    String authorizationHeader = request.headers().getClass(ApplicationConstant.AUTHORIZATION);
//                    log.info("====== Authenticate CMS Request ======");
//                    if (authorizationHeader != null && !authorizationHeader.isEmpty()) {
//                        String credentials = cmsClientId + ":" + cmsClientCredentials;
//                        String encodedCredentials = ApplicationConstants.BASIC
//                                + Base64.getEncoder().encodeToString(credentials.getBytes());
//
//                        if (encodedCredentials.equals(authorizationHeader)) {
//                            return true;
//                        }
//                        else {
//                            log.error("====== Failed to authenticate the request with header  ======");
//				throw new UnAuthneticatedException(HttpStatus.UNAUTHORIZED, 401, "Invalid client Id or Client secret provided");
//			}
//		} else {
//			log.error("====== Empty or null Authorization header provided ======");
//			throw new UnAuthneticatedException(HttpStatus.UNAUTHORIZED, 401, "Authorization header not provided");
//		}
//	}


	public Client validateAuthorization(HttpServletRequest request, String clientName) {

		log.info("===== BaseController :: validateAuthorization =====");
		String authorizationHeader = request.getHeader(ApplicationConstant.AUTHORIZATION);
		if (authorizationHeader != null && !authorizationHeader.isEmpty()){
			log.info("===== BaseController :: fetch ClientAPISecret =====");
			ClientAPISecret clientDetails = getClientDetails(clientName);
			if (clientDetails != null) {
				log.info("===== BaseController :: read client details =====");
				String clientId = clientDetails.getToken();
				String clientSecret = clientDetails.getSecret();
				String credentials = clientId + ":" + clientSecret;
				String dbEncodedCredentials = ApplicationConstant.BASIC + Base64.getEncoder().encodeToString(credentials.getBytes());

				if (dbEncodedCredentials.equals(authorizationHeader)){
					log.info("===== BaseController :: user authenticated successfully =====");
					return clientDetails.getClient();
				} else {
					log.error("====== Failed to authenticate the request with header ======");
					throw new UnAuthneticatedException(HttpStatus.UNAUTHORIZED, 401, ApplicationConstant.INVALID_CLIENT_ID_ERROR_MESSAGE);
				}

			} else {
				log.error("===== Client id and secret not found in DB for role   =====");
				throw new UnAuthneticatedException(HttpStatus.UNAUTHORIZED, 401, ApplicationConstant.INVALID_CLIENT_ID_ERROR_MESSAGE);
			}
		} else {
			log.error("===== Empty or null Authorization header provided =====");
			throw new UnAuthneticatedException(HttpStatus.UNAUTHORIZED, 401, ApplicationConstant.NO_AUTH_MESSAGE);
		}
	}


//	private ClientAPISecret getClientDetails(String clientName) {
//		ClientAPISecret clientDetails;
//		if(!clientName.equalsIgnoreCase(ApplicationConstant.ADMIN)) {
//			clientDetails = clientDetailsService.findByClientName(clientName);
//		}else {
//			clientDetails = clientDetailsService.findByClientType(ClientType.ADMIN);
//		}
//		return clientDetails;
//	}
private ClientAPISecret getClientDetails(String clientName) {
    if (clientName == null || clientName.isBlank()) {
        throw new IllegalArgumentException("Client name must not be null or empty");
    }
    ClientAPISecret clientDetails;
    switch (clientName.toUpperCase()) {
        case ApplicationConstant.ADMIN:
            clientDetails = clientDetailsService.findByClientType(ClientType.ADMIN);
            break;
        case ApplicationConstant.CANDIDATE_PORTAL:
            clientDetails = clientDetailsService.findByClientType(ClientType.CANDIDATE);
            break;
        default:
            clientDetails = clientDetailsService.findByClientName(clientName);
            break;
    }
    return clientDetails;
}
	
	
	private ClientSession getClientSessionAndCheckTokenExists(String encryptedToken) {
		log.info("======= check token exists in system =======");
	try {
	    ClientSession clientSession = clientSessionRepository.findByEncryptedToken(encryptedToken).orElse(null);
	    
	    if (clientSession == null) {
	        throw new InvalidEncryptedTokenException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_193,
	                customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_193)));
	    }
	    return clientSession;
	 }catch (Exception e) {
         log.error("======= Failed to validate the token =======");
         throw new InvalidEncryptedTokenException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_193,
                 customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_193)));
     }                
	}
	
	public ClientSession validateVPAPageToken(HttpServletRequest request) {
		String authorizationHeader = request.getHeader(ApplicationConstant.PAGE_TOKEN);

		if (authorizationHeader != null && !authorizationHeader.isEmpty()){
			return validateVPAToken(authorizationHeader);
		}
		else {
			throw new InvalidEncryptedTokenException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_193,
	                customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_193)));
		}
	}

	public ClientSession validateVPAToken(String token){
			
			ClientSession clientSession = getClientSessionAndCheckTokenExists(token);
			Date expirationTime = clientSession.getTokenExpirationTime();
			Date currentTime = new Date();
			if (expirationTime.getTime() >= currentTime.getTime()) {
				return clientSession;
			}
			else {
				throw new TokenexpiredException(HttpStatus.BAD_REQUEST,ApplicationConstant.HZ_196,
						customCodeMessageUtils.getMessageByCode(String.valueOf( ApplicationConstant.HZ_196)));
			}
	}

//	public boolean validateHmac(HttpRequest<?> request, String jsonString) {
//		String clientCode = request.getHeaders().get(ApplicationConstants.CLIENT_CODE);
//		String timestamp = request.getHeaders().get(ApplicationConstants.TIMESTAMP);
//		String hmac = request.getHeaders().get(ApplicationConstants.HMAC);
//
//		if (clientCode != null && timestamp != null && hmac != null && !clientCode.isEmpty() && !timestamp.isEmpty()
//				&& !hmac.isEmpty()) {
//
//			String finalStringForHmc = clientCode + timestamp + jsonString;
//
//			String algorithm = System.getenv(ApplicationConstants.HMAC_SHA_256);
//			String cmsClientSecret = System.getenv(ApplicationConstants.CMS_CLIENT_SECRET);
//			String generatedHmacString = signatureHmac.invoke(finalStringForHmc, cmsClientSecret,algorithm);
//
//
//			if (hmac.equals(generatedHmacString)) {
//				return true;
//			}
//			else {
//				log.error("======= Generated HMAC is not matched with the HMAC value passed in header   =======");
//				throw new UnAuthneticatedException(HttpStatus.UNAUTHORIZED, 401, "HMAC not matched");
//			}
//		} else {
//			log.error("======= Mandatory header is not provided clientCode: , timestamp: , HMAC:   ======= ");
//			throw new UnAuthneticatedException(HttpStatus.UNAUTHORIZED, 401,
//					"Mandatory header parameters are missing in request");
//		}
//	}

	public ClientSession validateSessionId(HttpServletRequest request) {
		String authorizationHeader = request.getHeader(ApplicationConstant.SESSION_ID);

		if (authorizationHeader != null && !authorizationHeader.isEmpty()){
			return validateSession(authorizationHeader);
		}
		else {
			throw new InvalidSessionIdException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_195,
	                customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_195)));
		}
	}
	
	public ClientSession validateSession(String sessionId ) {
		ClientSession clientSession = getAndCheckSessionExists(sessionId);
		Date expirationTime = clientSession.getSessionExpirationTime();
		Date currentTime = new Date();
		if (expirationTime.getTime() >= currentTime.getTime()) {
			return clientSession;
		}
		else {
			throw new SessionIdexpiredException(HttpStatus.BAD_REQUEST,ApplicationConstant.HZ_196,
					customCodeMessageUtils.getMessageByCode(String.valueOf( ApplicationConstant.HZ_196)));
		}
	}


	private ClientSession getAndCheckSessionExists(String sessionId) {
	  try {
		ClientSession clientSession = clientSessionRepository.findBySessionIdAndStatusTrue(sessionId).orElse(null);
	    
	    if (clientSession == null) {
	        throw new InvalidSessionIdException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_195,
	                customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_195)));
	    }
	    return clientSession;
	  } catch (Exception e) {
            log.error("======= Failed to validate the session =======");
            throw new InvalidSessionIdException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_195,
                    customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_195)));
        }
	}
}

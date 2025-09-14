package com.HZ.HireZentara.service.Impl;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.Admin.request.LoginRequest;
import com.HZ.HireZentara.dto.Admin.response.AdminUserDetailsResponse;
import com.HZ.HireZentara.dto.Admin.response.CaptchaResponse;
import com.HZ.HireZentara.dto.Admin.response.LoginResponse;
import com.HZ.HireZentara.dto.response.StatusResponse;
import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.ClientSession;
import com.HZ.HireZentara.entity.Users;
import com.HZ.HireZentara.exceptions.ApplicationException;
import com.HZ.HireZentara.repository.ClientSessionRepository;
import com.HZ.HireZentara.repository.UsersRepository;
import com.HZ.HireZentara.service.AdminService;
import com.HZ.HireZentara.utils.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import nl.captcha.Captcha;
import nl.captcha.backgrounds.GradiatedBackgroundProducer;
import nl.captcha.gimpy.DropShadowGimpyRenderer;
import nl.captcha.text.producer.DefaultTextProducer;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
public class AdminServiceImpl implements AdminService {

    private final UsersRepository usersRepository;
    private final PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils;
    private final IDGenerator idGenerator;
    private final ApplicationDateTimeUtil applicationDateTimeUtil;
    private final CustomErrorCodeMessageUtils customCodeMessageUtils;
    private final SessionStore sessionStore;
    private final ClientSessionRepository clientSessionRepository;
    private final ApplicationEnviornmentVariablesUtils applicationEnviornmentVariablesUtils;

    public AdminServiceImpl(UsersRepository usersRepository, PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils, IDGenerator idGenerator, ApplicationDateTimeUtil applicationDateTimeUtil, CustomErrorCodeMessageUtils customCodeMessageUtils, SessionStore sessionStore, ClientSessionRepository clientSessionRepository, ApplicationEnviornmentVariablesUtils applicationEnviornmentVariablesUtils) {
        this.usersRepository = usersRepository;
        this.portalAPIEncodeDecodeUtils = portalAPIEncodeDecodeUtils;
        this.idGenerator = idGenerator;
        this.applicationDateTimeUtil = applicationDateTimeUtil;
        this.customCodeMessageUtils = customCodeMessageUtils;
        this.sessionStore = sessionStore;
        this.clientSessionRepository = clientSessionRepository;
        this.applicationEnviornmentVariablesUtils = applicationEnviornmentVariablesUtils;
    }

    @Override
    public LoginResponse login( @Valid  LoginRequest loginRequest, HttpServletRequest httpRequest, Client client) {
        try {
            // 1. Validate captcha
            String sessionId = httpRequest.getHeader(ApplicationConstant.SESSION_ID);
            verifyCaptcha(loginRequest, sessionId);

            // 2. Fetch user
            Optional<Users> users = usersRepository.findByuserName(loginRequest.getUserName());
            if (users.isEmpty()) {
                log.error("==== User not found ==== ");
                throw new ApplicationException(
                        HttpStatus.BAD_REQUEST,
                        ApplicationConstant.HZ_1015, // define AUTH_FAILED properly
                        ApplicationConstant.AUTH_FAILED
                );
            }
            Users userDBData = users.get();
            // 3. Decrypt and validate password
            String decryptedPwd = portalAPIEncodeDecodeUtils.decryptBE(userDBData.getPassword())
                    .replaceAll("\"", "")
                    .trim();

            if (!userDBData.getUserName().equals(loginRequest.getUserName())) {
                log.error("==== Invalid user name ==== ");
                throw new ApplicationException(
                        HttpStatus.BAD_REQUEST,
                        ApplicationConstant.HZ_1016,
                        ApplicationConstant.AUTH_FAILED
                );
            }

            if (!decryptedPwd.equals(loginRequest.getPassword())) {
                log.error("==== Invalid password ==== ");
                throw new ApplicationException(
                        HttpStatus.BAD_REQUEST,
                        ApplicationConstant.HZ_1017,
                        ApplicationConstant.AUTH_FAILED
                );
            }

            // 4. Successful login
            log.info("Logged in user details verified successfully");
            String encryptedSession = createAndSaveSessionInfo();
            return generateSession(encryptedSession, ApplicationConstant.LOG_IN_SUCCESS);

        } catch (Exception e) {
            log.error("Failed to login ", e);
            throw e; // rethrow for GlobalExceptionHandler
        }
    }


    @Validated
    public void verifyCaptcha(@Valid LoginRequest loginRequest, String session) {
        String storedCaptchaText = sessionStore.removeSession(session);
        if (storedCaptchaText == null) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_1012,
                    customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_1012)));
        }
        if (storedCaptchaText != null && !storedCaptchaText.equals(loginRequest.getCaptcha())) {
            throw new ApplicationException(HttpStatus.BAD_REQUEST, ApplicationConstant.HZ_1011,
                    customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_1011)));
        }
    }

    private LoginResponse generateSession(String session, String status) {
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setSessionId(session);
        loginResponse.setMessage(status);
        return loginResponse;
    }

    private String createAndSaveSessionInfo() {
        try {
            Date sessionExpirationTimeStamp = applicationDateTimeUtil.addMinutestoDate(Integer.valueOf(applicationEnviornmentVariablesUtils.getSessionIdExpirationTime()));
            String sessions = idGenerator.generateSessionId();
            String encryptedSession = portalAPIEncodeDecodeUtils.generateEncryptedSessionId(sessions, sessionExpirationTimeStamp);
            createClientSession(sessions, sessionExpirationTimeStamp, encryptedSession);
            return encryptedSession;
        } catch (Exception e) {
            log.error("Failed to generate session and exception is {} ", e.getMessage());
            throw e;
        }
    }

    private void createClientSession(String session, Date sessionExpirationTimeStamp, String encryptedSession) {
        try {
            ClientSession clientSession = new ClientSession();
            clientSession.setEncryptedToken(encryptedSession);
            clientSession.setCreatedOn(new Date());
            clientSession.setSessionId(session);
            clientSession.setSessionExpirationTime(sessionExpirationTimeStamp);
            clientSession.setStatus(true);
            clientSession.setEncryptedSession(encryptedSession);
            clientSessionRepository.save(clientSession);
        } catch (Exception e) {
            throw new ApplicationException(HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR.hashCode(),
                    customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_1013)));
        }
    }

    @Override
    public CaptchaResponse generateCaptcha(HttpServletRequest httpRequest) {
        try {
            log.info("====== Generate Captcha ======  ");
            Captcha captcha = getCaptcha();
            log.info("Generated captcha value is {} ", captcha.getAnswer());
            String sessionId = sessionStore.saveCaptchaVal(captcha.getAnswer());
            log.info("========= generated sessionId ========== {} ", sessionId);

            BufferedImage bufferedImage = captcha.getImage();
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(bufferedImage, ApplicationConstant.FORMAT_TYPE, outputStream);
            byte[] generatedCaptcha = outputStream.toByteArray();

            CaptchaResponse captchaResponse = new CaptchaResponse();
            captchaResponse.setCaptcha(generatedCaptcha);
            captchaResponse.setSessionId(sessionId);

            return captchaResponse;
        } catch (Exception e) {
            log.error("Failed to generate captcha");
            throw new ApplicationException(HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR.hashCode(),
                    customCodeMessageUtils.getMessageByCode(String.valueOf(ApplicationConstant.HZ_1014)));
        }
    }

    private Captcha getCaptcha() {
        Captcha captcha = new Captcha.Builder(ApplicationConstant.CAPTCHA_WIDTH, ApplicationConstant.CAPTCHA_HEIGHT)
                .addText(new DefaultTextProducer(ApplicationConstant.CAPTCHA_CHAR_LENGTH, ApplicationConstant.DEFAULT_CHARS))
                .addBackground(new GradiatedBackgroundProducer())
                //.gimp(new DropShadowGimpyRenderer())
                .build();
        return captcha;
    }
    @Override
    public StatusResponse logout(ClientSession clientSession) {
            if(clientSession != null){
                clientSession.setStatus(false);
                 clientSessionRepository.save(clientSession);;
                log.info("Logged out successfully");
            return new StatusResponse(ApplicationConstant.LOGOUT_SUCCESS_MSG);
            }
            return new StatusResponse(ApplicationConstant.LOGOUT_FAILED_MSG);
    }

    @Override
    public AdminUserDetailsResponse getAdminUserDetails(String userName) {
        Optional<Users> users = usersRepository.findByuserName(userName);
        if(users.isEmpty()){
            throw new ApplicationException(HttpStatus.BAD_REQUEST, HttpStatus.BAD_REQUEST.hashCode(), ApplicationConstant.USERS_NOT_FOUND_MESSAGE);
        }
        Users userData = users.get();
        AdminUserDetailsResponse adminUserDetailsResponse = new AdminUserDetailsResponse();
        adminUserDetailsResponse.setFirstName(userData.getFirstName());
        adminUserDetailsResponse.setLastName(userData.getLastName());
        adminUserDetailsResponse.setMobile(userData.getMobile());
        adminUserDetailsResponse.setEmail(userData.getEmail());
        adminUserDetailsResponse.setRoles(userData.getRoles());
        adminUserDetailsResponse.setUserType(userData.getUserType());
        return adminUserDetailsResponse ;
    }
}

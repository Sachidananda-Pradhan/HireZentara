package com.HZ.HireZentara.utils;


import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class SessionStore {

    private final ConcurrentHashMap<String, String> captchaStore = new ConcurrentHashMap<>();


    public String saveCaptchaVal(String captcha) {
        log.info("Save Captcha value === {} ",captcha);
        String sessionId = UUID.randomUUID().toString();
        captchaStore.put(sessionId, captcha);
        return sessionId;
    }

    public String removeSession(String sessionId) {
        log.info("Remove session value === {} ",sessionId);
        String storedCaptcha = captchaStore.remove(sessionId);
        log.info("saved captcha is {} ",storedCaptcha);
        return storedCaptcha;
    }

    public String getCaptchaVal(String sessionId) {
        log.info("Get Captcha value for session ID === {}", sessionId);
        return captchaStore.get(sessionId);
    }
}

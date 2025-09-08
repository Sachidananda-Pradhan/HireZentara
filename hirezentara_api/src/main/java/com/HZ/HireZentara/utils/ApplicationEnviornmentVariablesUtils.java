package com.HZ.HireZentara.utils;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.security")
@Data
public class ApplicationEnviornmentVariablesUtils {

    private String apiIV;
    private String encodingAlgo;
    private String apiKey;
    private String aesStr;
    private String encoderStr;
    private String sessionIdExpirationTime;

}

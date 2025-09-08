package com.HZ.HireZentara.utils;

import com.HZ.HireZentara.entity.ClientAPISecret;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;

@Service
public class ClientIdAndSecretGenerator {

    public ClientAPISecret generateClientIdAndSecret(ClientAPISecret clientDetails) {
        byte[] clientIdBytes = generateSecureRandomBytes(16); // 16 bytes = 128 bits
        byte[] clientSecretBytes = generateSecureRandomBytes(32); // 32 bytes = 256 bits
        String clientId = Base64.getUrlEncoder().withoutPadding().encodeToString(clientIdBytes);
        String clientSecret = Base64.getUrlEncoder().withoutPadding().encodeToString(clientSecretBytes);
        clientDetails.setToken(clientId);
        clientDetails.setSecret(clientSecret);
        return clientDetails;

    }

    private byte[] generateSecureRandomBytes(int length) {
        SecureRandom secureRandom = new SecureRandom();
        byte[] randomBytes = new byte[length];
        secureRandom.nextBytes(randomBytes);
        return randomBytes;
    }


}

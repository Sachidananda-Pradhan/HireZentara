package com.HZ.HireZentara.utils;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CustomErrorCodeMessageUtils {

    private static Map<String, String> map; 

    static
    { 
        map = new HashMap<>(); 
        map.put("000", "Success");
        map.put("100", "Time out");
        map.put("165", "OTP does not match");
        map.put("175", "Insufficient Amount");
        map.put("190", "Provided referenceNo does not exist");
        map.put("191", "Transaction Id does not exist");
        map.put("192", "Token has expired");
        map.put("193", "Invalid Encrypted Token ");
        map.put("195", "Invalid Session Id ");
        map.put("196", "Session has expired");
        map.put("303", "Refund account not found");
        map.put("400", "Failed to process request");    
        map.put("404", "Account details not configured");
        map.put("500", "Internal Server Error");
        map.put("515", "Application is under maintenance.");
        map.put("1001", "Failed, invalid Message Type");
        map.put("1002", "Failed, invalid Amount");
        map.put("1003", "Failed, invalid Sender Account Number, Account Number should be 14 digit only");
        map.put("1004", "Failed, invalid UTR Number");
        map.put("1005", "Failed, UTR Number already Exists");
        map.put("1006", "Failed, invalid IFSC Code, IFSC Code should be 11 digit only");
        map.put("1007", "Failed, Sender Account Number Not exists");
        map.put("1008", "Invalid Token No");
        map.put("1009", "Failed to login");
        map.put("1010", "Authentication failed");
        map.put("1011", "Invalid captcha");
        map.put("1012", "Failed fetch captcha");
        map.put("1013", "Failed insert/update data in DB");
        map.put("1014", "Failed to download receipt");
        map.put("1015", "Failed to logout");
        map.put("1016","Invalid user details");
        map.put("1017","Invalid password");
        map.put("1018", "Http too many requests");
        map.put("1019", "Failed to update server down time notification");
        map.put("1020", "Login failed");
        map.put("1021", "Limit exceeded");
        map.put("1022", "Failed to process request");

    }

    public String getMessageByCode(String code)
    {
    	return map.get(code);
    }
    
}

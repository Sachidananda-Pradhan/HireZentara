package com.HZ.HireZentara.utils;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.UUID;


@Service
public class IDGenerator {

	
	public  String generateCorrelationId()
	{
		SecureRandom secureRnd = new SecureRandom();
	    char [] digits = new char[11];
	    digits[0] = (char) (secureRnd.nextInt(9) + '1');
	    for(int i=1; i<digits.length; i++) {
	        digits[i] = (char) (secureRnd.nextInt(10) + '0');
	    }
	    return new String(digits);
	}

	public  String generateTransactionId()
	{
		SecureRandom secureRnd = new SecureRandom();
	    char [] digits = new char[11];
	    digits[0] = (char) (secureRnd.nextInt(9) + '1');
	    for(int i=1; i<digits.length; i++) {
	        digits[i] = (char) (secureRnd.nextInt(10) + '0');
	    }
	    return new String(digits);
	}
	
	public  String generateLinkDataId()
	{
		SecureRandom secureRnd = new SecureRandom();
	    char [] digits = new char[6];
	    digits[0] = (char) (secureRnd.nextInt(9) + '1');
	    for(int i=1; i<digits.length; i++) {
	        digits[i] = (char) (secureRnd.nextInt(10) + '0');
	    }
	    return new String(digits);
	}
	
	public  String generateOTPReferenceNo()
	{
		SecureRandom secureRnd = new SecureRandom();
	    char [] digits = new char[6];
	    digits[0] = (char) (secureRnd.nextInt(9) + '1');
	    for(int i=1; i<digits.length; i++) {
	        digits[i] = (char) (secureRnd.nextInt(10) + '0');
	    }
	    return new String(digits);
	}


	public String generateSessionId() {
		String randomPart = UUID.randomUUID().toString();
		return randomPart;
	}

}

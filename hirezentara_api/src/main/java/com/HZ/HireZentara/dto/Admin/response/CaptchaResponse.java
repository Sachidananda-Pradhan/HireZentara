package com.HZ.HireZentara.dto.Admin.response;

import lombok.*;

@Data
public class CaptchaResponse {

	private String sessionId;
	private byte[] captcha;
}

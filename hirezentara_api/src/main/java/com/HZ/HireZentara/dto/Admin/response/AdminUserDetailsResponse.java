package com.HZ.HireZentara.dto.Admin.response;

import java.util.Date;

import com.HZ.HireZentara.entity.Roles;
import com.HZ.HireZentara.entity.Users;
import com.HZ.HireZentara.enums.UserType;

import lombok.Data;

@Data
public class AdminUserDetailsResponse {
	
	private String firstName;
    private String lastName;
	private String email;
	private String mobile;
	private Roles roles;
	private UserType  userType;
}

package com.HZ.HireZentara.service;

import java.util.List;

import com.HZ.HireZentara.entity.Users;

public interface IUserService {
	public Users createUser(Users user);

	public List<Users> getAllUsers();

	public Users getUserByName(String userName);

}

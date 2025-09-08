package com.HZ.HireZentara.service.Impl;

import java.util.List;
import java.util.Optional;

import com.HZ.HireZentara.entity.Roles;
import com.HZ.HireZentara.entity.Users;
import com.HZ.HireZentara.exceptions.ApplicationException;
import com.HZ.HireZentara.repository.RoleRepository;
import com.HZ.HireZentara.repository.UsersRepository;
import com.HZ.HireZentara.service.IUserService;
import com.HZ.HireZentara.utils.PortalAPIEncodeDecodeUtils;


import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Transactional
@Slf4j
public class UserServiceImpl implements IUserService {

	private final UsersRepository usersRepository;

	private final RoleRepository roleRepository;
	
	private final PortalAPIEncodeDecodeUtils encodeDecodeUtils;

	public UserServiceImpl(UsersRepository usersRepository,RoleRepository roleRepository,PortalAPIEncodeDecodeUtils encodeDecodeUtils) {
		this.usersRepository = usersRepository;
		this.roleRepository = roleRepository;
		this.encodeDecodeUtils = encodeDecodeUtils;
	}

	@Override
	public Users createUser(Users user) {

		log.info("--------> "+user.getPassword());
		String password = encodeDecodeUtils.encryptBE(user.getPassword());
		String mobileNo = encodeDecodeUtils.encryptBE(user.getMobile());
		Long roleId = user.getRoles().getId(); 
		if (roleId == null) {
	        throw new IllegalArgumentException("Role ID cannot be null");
	    }
		 Optional<Roles> role = roleRepository.findById(roleId);
		 if(!role.isPresent()) {
			 throw new ApplicationException(HttpStatus.BAD_REQUEST,HttpStatus.BAD_REQUEST.hashCode(), " Role Not found ");
		 }else{
			 user.setRoles(role.get());
		 }
		user.setPassword(password);
		user.setMobile(mobileNo);
		return usersRepository.save(user);
	}

	@Override
	public List<Users> getAllUsers() {
		return usersRepository.findAll();
	}

	@Override
	public Users getUserByName(String userName) {
	    try {
	        log.info(" userName " + userName);
	        return usersRepository.findByuserName(userName).orElse(null);
	    } catch (Exception e) {
	        log.error("An error occurred while getting user by name: " + userName, e);
	        return null;
	    }
	}
}

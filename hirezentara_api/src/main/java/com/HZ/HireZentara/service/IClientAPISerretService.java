package com.HZ.HireZentara.service;

import java.util.List;

import com.HZ.HireZentara.entity.ClientAPISecret;
import com.HZ.HireZentara.enums.ClientType;

public interface IClientAPISerretService {
	ClientAPISecret saveClient(ClientAPISecret clientAPISecret);

	List<ClientAPISecret> getAllClientCredentials();

	ClientAPISecret findByClientName(String clientName);

	ClientAPISecret findByClientType(ClientType clientName);

}

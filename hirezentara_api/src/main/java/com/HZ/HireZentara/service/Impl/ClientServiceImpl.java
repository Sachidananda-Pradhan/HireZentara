package com.HZ.HireZentara.service.impl;

import java.util.Date;

import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.ClientAPISecret;
import com.HZ.HireZentara.enums.Status;
import com.HZ.HireZentara.repository.ClientRepository;
import com.HZ.HireZentara.service.IClientAPISerretService;
import com.HZ.HireZentara.service.IClientService;


import org.springframework.stereotype.Service;

@Service
public class ClientServiceImpl implements IClientService {

	private final ClientRepository clientRepository;
	private final IClientAPISerretService clientAPISecretService;

	
	ClientServiceImpl(ClientRepository clientRepository, IClientAPISerretService clientAPISecretService )
	{
		this.clientRepository=clientRepository;
		this.clientAPISecretService=clientAPISecretService;
	}

	@Override
	public ClientAPISecret saveClient(Client client) 
	{
		Date date = new Date();
		client.setUpdatedAt(date);
		client.setCreatedAt(date);
		client.setStatus(Status.ACTIVE);
		client= clientRepository.save(client);
		ClientAPISecret clientAPISecret= new ClientAPISecret();
		clientAPISecret.setClient(client);
		return clientAPISecretService.saveClient(clientAPISecret);
	}

}

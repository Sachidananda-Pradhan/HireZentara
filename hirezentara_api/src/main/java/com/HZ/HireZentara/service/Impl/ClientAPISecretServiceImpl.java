package com.HZ.HireZentara.service.Impl;

import java.util.List;
import com.HZ.HireZentara.entity.ClientAPISecret;
import com.HZ.HireZentara.enums.ClientType;
import com.HZ.HireZentara.repository.ClientAPISecretRepository;
import com.HZ.HireZentara.service.IClientAPISerretService;
import com.HZ.HireZentara.utils.ClientIdAndSecretGenerator;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Transactional
@Slf4j
public class ClientAPISecretServiceImpl implements IClientAPISerretService {

	private final ClientAPISecretRepository clientAPISecretRepository;

	private final ClientIdAndSecretGenerator clientIdAndSecretGenerator;
	
	public ClientAPISecretServiceImpl(ClientAPISecretRepository clientAPISecretRepository, ClientIdAndSecretGenerator clientIdAndSecretGenerator) {
		this.clientAPISecretRepository=clientAPISecretRepository;
		this.clientIdAndSecretGenerator=clientIdAndSecretGenerator;
	}
	
	public ClientAPISecret saveClient(ClientAPISecret clientDetails) {
		clientDetails= clientIdAndSecretGenerator.generateClientIdAndSecret( clientDetails);
		clientDetails= clientAPISecretRepository.save(clientDetails);
		return clientDetails;
	}
	
	public List<ClientAPISecret> getAllClientCredentials()
	{
		return clientAPISecretRepository.findAll();
	}
	
	public ClientAPISecret findByClientName(String clientName) {
	    try {
	        return  clientAPISecretRepository.findByClient_ClientName(clientName).orElse(null);
	    } catch (Exception e) {
	        log.error("Error finding ClientAPISecret by client name: " + clientName);
	        return null;
	    }
	}


	@Override
	public ClientAPISecret findByClientType(ClientType clientName) {
	    try {
	        return  clientAPISecretRepository.findByClient_ClientType(clientName).orElse(null);
	    } catch (Exception e) {
			log.error("Error finding client type by client name ");
	        return null;
	    }
	}
}

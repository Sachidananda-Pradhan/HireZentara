package com.HZ.HireZentara.service;

import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.ClientAPISecret;

public interface IClientService {

	ClientAPISecret saveClient(Client object);

}

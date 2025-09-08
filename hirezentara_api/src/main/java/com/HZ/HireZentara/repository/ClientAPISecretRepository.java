package com.HZ.HireZentara.repository;

import com.HZ.HireZentara.entity.ClientAPISecret;
import com.HZ.HireZentara.enums.ClientType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface ClientAPISecretRepository extends JpaRepository<ClientAPISecret,Long> {
    Optional<ClientAPISecret> findByClient_ClientType(ClientType clientType);

    Optional<ClientAPISecret> findByClient_ClientName(String clientName);

}

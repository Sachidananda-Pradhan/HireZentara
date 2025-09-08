package com.HZ.HireZentara.repository;

import com.HZ.HireZentara.entity.ClientSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientSessionRepository extends JpaRepository<ClientSession , Long> {

    Optional<ClientSession> findByEncryptedToken(String encryptedToken);

    @Query("SELECT cs FROM ClientSession cs  WHERE cs.encryptedSession = :sessionId and cs.status = true")
    Optional<ClientSession> findBySessionIdAndStatusTrue(String sessionId);

}

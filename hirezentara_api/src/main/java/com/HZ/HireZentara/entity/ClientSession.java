package com.HZ.HireZentara.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Data
@Table(schema = "HIRE_ZENTARA", name = "CLIENT_SESSION")
public class ClientSession {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CS_SEQ")
    @SequenceGenerator(sequenceName = "clientsession_seq", allocationSize = 1, name = "CS_SEQ")
	private Long id;

	@Column(name = "session_id", length=100, nullable=false)
	private String sessionId;
	
	@Column(name="encrypted_token ", length = 500, nullable = false)
	private String encryptedToken  ;
	
	@Column(name ="token_expiration_time", length =  100, nullable = true)
	private Date tokenExpirationTime;
	
	@Column(name ="page_redirection_time", length =  100, nullable = true)
	private Date pageRedirectionTime;
	
	@Column(name="redirect_url", length = 100, nullable =true)
	private String redirectUrl;
	
	@Column(name="session_expiration_time",length =  100, nullable = true)
	private Date sessionExpirationTime;
	
	@Column(name="encrypted_session ", length = 500, nullable = true)
	private String encryptedSession ;
	
	@Column(name="status",length  =10,nullable = true)
	private boolean status;
	
	@Column(name = "created_on")
	private Date createdOn;
}

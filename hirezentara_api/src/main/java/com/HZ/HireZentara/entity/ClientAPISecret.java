package com.HZ.HireZentara.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

/**
 * This table holds the details of the client which are going to use the API, Here we will be storing the client id, secret, client role etc
 */
@Entity
@Data
@Table(schema = "HIRE_ZENTARA", name = "CLIENT_API_SECRET")
public class ClientAPISecret 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(name = "tokem", length = 50, unique = true)
	private String token;

	@Column(name = "secret", length = 100, unique = true)
	private String secret;
	
	@OneToOne
	@JoinColumn(name="client_id", insertable=true, updatable=true)
	private Client client;
	
}

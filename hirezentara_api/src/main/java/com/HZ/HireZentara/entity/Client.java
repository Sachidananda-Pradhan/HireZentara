package com.HZ.HireZentara.entity;

import com.HZ.HireZentara.enums.BusinessModel;
import com.HZ.HireZentara.enums.ClientType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

/**
 * This table holds the details of the client which are going to use the API, Here we will be storing the client id, secret, client role etc
 */
@Entity
@Data
@Table(schema = "HIRE_ZENTARA", name = "CLIENT")
public class Client extends BaseEntity   {
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(name = "financial_code", length = 100)
	private String financialCode;
	
	@Column(name = "client_name", length = 30)
	private String clientName;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "client_type", length = 50, unique = false)
	private ClientType clientType;

	@Enumerated(EnumType.STRING)
	@Column(name = "business_model", length = 100, unique = false)
	private BusinessModel businessModel;

}

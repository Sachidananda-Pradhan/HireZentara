package com.HZ.HireZentara.entity;

import com.HZ.HireZentara.enums.RoleCode;


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

@Entity
@Data 
@Table(schema = "HIRE_ZENTARA", name = "ROLES")
public class Roles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(name = "role_name", length = 30, unique = true)
	private String roleName;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "role_code", length = 30, unique = true)
	private RoleCode roleCode;

	@Column(name = "role_description", length = 100)
	private String roleDescription;

}

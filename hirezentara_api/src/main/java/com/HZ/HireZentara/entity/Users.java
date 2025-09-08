package com.HZ.HireZentara.entity;

import com.HZ.HireZentara.enums.UserType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(schema = "HIRE_ZENTARA", name = "USERS")
public class Users {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USERS_SEQ")
    @SequenceGenerator(sequenceName = "users_seq", allocationSize = 1, name = "USERS_SEQ")
	private Long id;

	@Column(name = "user_name", length = 30, unique = true)
	private String userName;

	@Column(name = "email", length = 50, unique = true)
	private String email;

	@Column(name = "first_name", length = 30)
	private String firstName;

	@Column(name = "last_name", length = 30)
	private String lastName;

	@Column(name = "password", length=512)
	private String password;
	
	@Column(name = "mobile", length=512)
	private String mobile;
	
	@Column(name = "is_active")
	private boolean isPortalAccessEnabled=false;
	
	@OneToOne
	@JoinColumn(name="role_id", insertable=true, updatable=true)
	private Roles roles;
    
	@Enumerated(EnumType.STRING)
	@Column(name = "user_type",length = 50, nullable = true)
	private UserType userType;

}

package com.HZ.HireZentara.entity;

import java.io.Serializable;
import java.util.Date;

import com.HZ.HireZentara.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@Data
@MappedSuperclass
public class BaseEntity  implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Column(name = "created_at", nullable = true)
	private Date createdAt;
	
	@Column(name = "updated_at", nullable = true)
	private Date updatedAt;
	
	@Column(name = "created_by")
	private String createdBy;
	
	@Column(name = "updated_by")
	private String updatedBy;
	
	@Enumerated(EnumType.ORDINAL)
	@Column(name = "status",length = 50, nullable = true)
	private Status status;
}

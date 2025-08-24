package com.HZ.HireZentara.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

import java.time.LocalDateTime;

@MappedSuperclass
@Data
public class CommonEntity {

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name ="created_by")
    private  String createdBy;

    @Column(name="updated_by")
    private String updatedBy;
}

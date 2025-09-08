package com.HZ.HireZentara.dto.response;

import lombok.Data;

@Data
public class CandidateRegistrationResposne {
    private String message;

    public CandidateRegistrationResposne(String message) {
        this.message = message;
    }
}

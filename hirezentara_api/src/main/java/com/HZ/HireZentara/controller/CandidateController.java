package com.HZ.HireZentara.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    // Candidate Registration
    @PostMapping("/register")
    public ResponseEntity<String> registerCandidate(
            @Valid @RequestPart("registrationDTO") CandidateRegistrationDTO registrationDTO,
            @RequestPart("resume") MultipartFile resume) {
        try {
            candidateService.registerCandidate(registrationDTO, resume);
            return ResponseEntity.ok("Candidate registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    // Get Job Details by Job ID
    @GetMapping("/jobs/{jobId}")
    public ResponseEntity<JobDetailsResponseDTO> getJobDetails(@PathVariable String jobId) {
        try {
            JobDetailsResponseDTO jobDetails = jobService.getJobDetails(jobId);
            if (jobDetails != null) {
                return ResponseEntity.ok(jobDetails);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new JobDetailsResponseDTO(jobId, "Error fetching job details: " + e.getMessage()));
        }
    }
}

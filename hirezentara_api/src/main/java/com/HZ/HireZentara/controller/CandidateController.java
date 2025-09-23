package com.HZ.HireZentara.controller;



import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.CandidateResponse;
import com.HZ.HireZentara.dto.request.APIRequest;
import com.HZ.HireZentara.dto.request.CandidateInterviewSchedulerRequest;
import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.response.APIResponse;
import com.HZ.HireZentara.dto.response.CandidateAndJobDetailsResponse;
import com.HZ.HireZentara.dto.response.CandidateRegistrationResposne;
import com.HZ.HireZentara.dto.response.InterviewDetailsResponse;
import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.InterviewDetails;
import com.HZ.HireZentara.exceptions.ExceptionResponseGenerator;
import com.HZ.HireZentara.repository.ClientSessionRepository;
import com.HZ.HireZentara.service.CandidateService;
import com.HZ.HireZentara.service.IClientAPISerretService;
import com.HZ.HireZentara.service.JobDetailsService;
import com.HZ.HireZentara.utils.APIResponseUtils;
import com.HZ.HireZentara.utils.CustomErrorCodeMessageUtils;
import com.HZ.HireZentara.utils.PortalAPIEncodeDecodeUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/candidates")
public class CandidateController extends BaseController {

    private final CandidateService candidateService;
    private final PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils;
    private final APIResponseUtils apiResponseUtils;
    private final ExceptionResponseGenerator exceptionResponseGenerator;
    private final JobDetailsService jobDetailsService;
    private final ObjectMapper objectMapper;

    public CandidateController(CandidateService candidateService, IClientAPISerretService clientDetailsService,
                               ClientSessionRepository clientSessionRepository, CustomErrorCodeMessageUtils customCodeMessageUtils, PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils, APIResponseUtils apiResponseUtils, ExceptionResponseGenerator exceptionResponseGenerator, JobDetailsService jobDetailsService, ObjectMapper objectMapper) {
        super(clientDetailsService, clientSessionRepository, customCodeMessageUtils);
        this.candidateService = candidateService;
        this.portalAPIEncodeDecodeUtils = portalAPIEncodeDecodeUtils;
        this.apiResponseUtils = apiResponseUtils;
        this.exceptionResponseGenerator = exceptionResponseGenerator;
        this.jobDetailsService = jobDetailsService;
        this.objectMapper = objectMapper;
    }

    // Candidate Registration
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse registerCandidate(@RequestPart("apiRequest") String encryptedApirequest, @RequestPart("resume") MultipartFile resume,
                                         HttpServletRequest httpRequest) throws Exception {
        Client client = validateAuthorization(httpRequest, ApplicationConstant.CANDIDATE_PORTAL);
        APIRequest apiRequest = objectMapper.readValue(encryptedApirequest, APIRequest.class);

        try {
            Object object = portalAPIEncodeDecodeUtils.decryptObject(apiRequest, CandidateRegistrationRequest.class);

            if (object instanceof CandidateRegistrationRequest) {
                CandidateRegistrationRequest candidateRegistrationRequest = (CandidateRegistrationRequest) object;

                CandidateRegistrationResposne candidateRegistrationResposne =
                        candidateService.registerCandidate(candidateRegistrationRequest, resume);

                return apiResponseUtils.generateExternalApiResponse(
                        ApplicationConstant.SUCCESS,
                        ApplicationConstant.SUCCESS_200,
                        candidateRegistrationResposne,
                        null
                );
            } else {
                log.error("Request does not contain candidate details");
                return exceptionResponseGenerator.customErrorResponse(1,
                        "Request does not contain candidate details");
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to process request: {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }

    //get candidate by id
    @GetMapping("/getCandidate")
    public APIResponse getCandaiateById(@RequestParam String candidateId, HttpServletRequest httpRequest) {
        try {
            // Validate Authorization
            validateSessionId(httpRequest);
            // Fetch job details
            CandidateAndJobDetailsResponse candidate = candidateService.getCandidateById(candidateId);
            return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                    ApplicationConstant.SUCCESS_200, candidate, null);
        } catch (Exception e) {
            log.error("getCandaiateById :: Failed to process request : {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }

    @DeleteMapping("/deleteCandidate")
    public APIResponse deleteCandidateById(@RequestParam String candidateId, HttpServletRequest httpRequest) {
        try {
            // Validate Authorization
            validateSessionId(httpRequest);
            // Fetch job details
            String response = candidateService.deleteCandidateById(candidateId);
            return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                    ApplicationConstant.SUCCESS_200, response, null);
        } catch (Exception e) {
            log.error("deleteCandidateById :: Failed to process request : {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }

    @PutMapping("updateCandidateStatus")
    public APIResponse updateCandidateStatus(@RequestParam String candidateId, @RequestParam String candidateStatus
            , HttpServletRequest httpRequest) {
        try {
            // Validate Authorization
            validateSessionId(httpRequest);
            // Fetch job details
            String response = candidateService.updateCandidateStatus(candidateId, candidateStatus);
            return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                    ApplicationConstant.SUCCESS_200, response, null);
        } catch (Exception e) {
            log.error("updateCandidateStatus :: Failed to process request : {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }

    @PostMapping("/scheduleInterview")
    public APIResponse scheduleInterview(@RequestBody APIRequest apiRequest,@RequestParam String candidateId, HttpServletRequest httpRequest) {
        try {
            validateSessionId(httpRequest);
            try {
                Object object = portalAPIEncodeDecodeUtils.decryptObject(apiRequest, CandidateInterviewSchedulerRequest.class);

                if (object instanceof CandidateInterviewSchedulerRequest) {
                    CandidateInterviewSchedulerRequest candidateInterviewSchedulerRequest = (CandidateInterviewSchedulerRequest) object;
                    String scheduleInterviewResponse = candidateService.scheduleInterview(candidateInterviewSchedulerRequest,candidateId);
                    return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, scheduleInterviewResponse, null
                    );
                } else {
                    log.error("Request does not contain candidate details");
                    return exceptionResponseGenerator.customErrorResponse(1,
                            "Request does not contain candidate details");
                }
            } catch (JsonProcessingException e) {
                log.error("Failed to process request: {}", e.getMessage());
                return exceptionResponseGenerator.failedToProcessResponse();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("interviewSlots")
    public APIResponse getInterviewSlots(@RequestParam String candidateId, HttpServletRequest httpRequest){
        try {
            // Validate Authorization
            validateSessionId(httpRequest);
         List<InterviewDetailsResponse> interviewDetails = candidateService.getInterviewSlots(candidateId);
            return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                    ApplicationConstant.SUCCESS_200, interviewDetails, null);
        } catch (Exception e) {
            log.error("getInterviewSlots :: Failed to process request : {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }

//    @PutMapping("reScheduleInterview")
//    public APIResponse reScheduleInterview(@RequestBody APIRequest apiRequest,@RequestParam String candidateId, HttpServletRequest httpRequest,Long interviewId) {
//        try {
//            validateSessionId(httpRequest);
//            try {
//                Object object = portalAPIEncodeDecodeUtils.decryptObject(apiRequest, CandidateInterviewSchedulerRequest.class);
//
//                if (object instanceof CandidateRegistrationRequest) {
//                    CandidateInterviewSchedulerRequest candidateInterviewSchedulerRequest = (CandidateInterviewSchedulerRequest) object;
//                    String scheduleInterviewResponse = candidateService.reScheduleInterview(candidateInterviewSchedulerRequest, candidateId, interviewId);
//                    return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, scheduleInterviewResponse, null
//                    );
//                } else {
//                    log.error("Request does not contain candidate details");
//                    return exceptionResponseGenerator.customErrorResponse(1,
//                            "Request does not contain candidate details");
//                }
//            } catch (JsonProcessingException e) {
//                log.error("Failed to process request: {}", e.getMessage());
//                return exceptionResponseGenerator.failedToProcessResponse();
//            }
//        } catch (Exception e) {
//            throw new RuntimeException(e);
//        }
//    }

    @GetMapping("getInterviewDetails")
    public APIResponse getInterviewDetails(@RequestParam String candidateId, @RequestParam Long interviewId, HttpServletRequest httpRequest) {
        try {
            validateSessionId(httpRequest);
            InterviewDetails interviewDetails = candidateService.getInterviewDetails(candidateId, interviewId);
            if (interviewDetails != null) {
                return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, interviewDetails, null
                );
            } else {
                log.error("Interview not found for candidateId: {} and interviewId: {}", candidateId, interviewId);
                return exceptionResponseGenerator.customErrorResponse(1, "Interview not found");
            }

        } catch (Exception e) {
            log.error("Failed to fetch interview details: {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }

    @DeleteMapping("/cancelInterview")
        public APIResponse cancelInterview(@RequestParam String candidateId,HttpServletRequest httpRequest, @RequestParam Long interviewId) {
             validateSessionId(httpRequest);
                try {
                    String response = candidateService.cancelInterview(candidateId, interviewId);
                    return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                            ApplicationConstant.SUCCESS_200, response, null);
                } catch (Exception e) {
                    log.error("cancelInterview :: Failed to process request : {}", e.getMessage());
                    return exceptionResponseGenerator.failedToProcessResponse();
                }
        }
}

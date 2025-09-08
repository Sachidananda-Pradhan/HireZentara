package com.HZ.HireZentara.controller;



import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.request.APIRequest;
import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.response.APIResponse;
import com.HZ.HireZentara.dto.response.CandidateRegistrationResposne;
import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.JobDetails;
import com.HZ.HireZentara.exceptions.ExceptionResponseGenerator;
import com.HZ.HireZentara.repository.ClientSessionRepository;
import com.HZ.HireZentara.service.CandidateService;
import com.HZ.HireZentara.service.IClientAPISerretService;
import com.HZ.HireZentara.service.JobDetailsService;
import com.HZ.HireZentara.utils.APIResponseUtils;
import com.HZ.HireZentara.utils.CustomErrorCodeMessageUtils;
import com.HZ.HireZentara.utils.PortalAPIEncodeDecodeUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/candidates")
public class CandidateController extends BaseController {

    private final CandidateService candidateService;
    private  final PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils;
    private  final APIResponseUtils apiResponseUtils;
    private  final ExceptionResponseGenerator exceptionResponseGenerator;
    private final JobDetailsService jobDetailsService;

    public CandidateController(CandidateService candidateService, IClientAPISerretService clientDetailsService,
                               ClientSessionRepository clientSessionRepository, CustomErrorCodeMessageUtils customCodeMessageUtils, PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils, APIResponseUtils apiResponseUtils, ExceptionResponseGenerator exceptionResponseGenerator, JobDetailsService jobDetailsService) {
        super(clientDetailsService, clientSessionRepository, customCodeMessageUtils);
        this.candidateService = candidateService;
        this.portalAPIEncodeDecodeUtils = portalAPIEncodeDecodeUtils;
        this.apiResponseUtils = apiResponseUtils;
        this.exceptionResponseGenerator = exceptionResponseGenerator;
        this.jobDetailsService = jobDetailsService;
    }

    // Candidate Registration
    @PostMapping("/register")
    public APIResponse registerCandidate(@RequestBody @Valid APIRequest apiRequest, HttpServletRequest httpRequest,@RequestPart("resume") MultipartFile resume)
            throws Exception {

        Client client=validateAuthorization(httpRequest, ApplicationConstant.CANDIDATE_PORTAL);

        Object object = null;
        try {
            object = portalAPIEncodeDecodeUtils.decryptObject(apiRequest,CandidateRegistrationRequest.class);
            if (object instanceof CandidateRegistrationRequest) {
                CandidateRegistrationRequest  candidateRegistrationRequest = (CandidateRegistrationRequest) object;

                CandidateRegistrationResposne candidateRegistrationResposne = candidateService.registerCandidate(candidateRegistrationRequest, resume);
                return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                        ApplicationConstant.SUCCESS_200, candidateRegistrationResposne, null);

            } else {
                log.error("Request does not contains candidate details");
                return exceptionResponseGenerator.customErrorResponse(1,
                        "Request does not contains candidate details");
            }
        } catch (JsonProcessingException e) {
            log.error("Failed to process request : {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }


    // Get Job Details by Job ID
    @GetMapping("/jobs/{jobId}")
    public APIResponse getJobDetailsById(@PathVariable Long jobId, HttpServletRequest httpRequest) {
        try {
            // Validate Authorization
            Client client = validateAuthorization(httpRequest, ApplicationConstant.CANDIDATE_PORTAL);

            // Fetch job details
             JobDetails jobDetails = jobDetailsService.getJobDetailsById(jobId);
            return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                    ApplicationConstant.SUCCESS_200, jobDetails, null);
        } catch (Exception e) {
            log.error("Error fetching job details: {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }
}

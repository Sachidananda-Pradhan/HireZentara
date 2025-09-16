package com.HZ.HireZentara.controller;



import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.request.APIRequest;
import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.response.APIResponse;
import com.HZ.HireZentara.dto.response.CandidateRegistrationResposne;
import com.HZ.HireZentara.dto.response.JobDetailsResponse;
import com.HZ.HireZentara.entity.Candidate;
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
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
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
    public APIResponse registerCandidate(@RequestPart("apiRequest") String  encryptedApirequest, @RequestPart("resume") MultipartFile resume,
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
    public APIResponse getCandaiateById (@RequestParam String candidateid , HttpServletRequest httpRequest) {
        try {
            // Validate Authorization
            validateSessionId(httpRequest);
            // Fetch job details
            Candidate  candidate  = candidateService.getCandidateById(candidateid);
            return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                    ApplicationConstant.SUCCESS_200, candidate, null);
        } catch (Exception e) {
            log.error("getCandaiateById :: Failed to process request : {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }

}

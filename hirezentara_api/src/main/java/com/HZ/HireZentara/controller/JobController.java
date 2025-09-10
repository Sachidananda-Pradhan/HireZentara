package com.HZ.HireZentara.controller;

import com.HZ.HireZentara.constant.ApplicationConstant;
import com.HZ.HireZentara.dto.request.APIRequest;
import com.HZ.HireZentara.dto.request.CandidateRegistrationRequest;
import com.HZ.HireZentara.dto.request.JobDetailsRequest;
import com.HZ.HireZentara.dto.response.APIResponse;
import com.HZ.HireZentara.dto.response.CandidateListResponse;
import com.HZ.HireZentara.dto.response.JobDetailsResponse;
import com.HZ.HireZentara.dto.response.PageResponse;
import com.HZ.HireZentara.entity.Client;
import com.HZ.HireZentara.entity.JobDetails;
import com.HZ.HireZentara.exceptions.ExceptionResponseGenerator;
import com.HZ.HireZentara.repository.ClientSessionRepository;
import com.HZ.HireZentara.service.IClientAPISerretService;
import com.HZ.HireZentara.service.JobDetailsService;
import com.HZ.HireZentara.utils.APIResponseUtils;
import com.HZ.HireZentara.utils.CustomErrorCodeMessageUtils;
import com.HZ.HireZentara.utils.PortalAPIEncodeDecodeUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/job")
public class JobController extends BaseController {

    private  final ExceptionResponseGenerator exceptionResponseGenerator;
    private  final APIResponseUtils apiResponseUtils;
    private  final PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils;
    private  final CustomErrorCodeMessageUtils customErrorCodeMessageUtils;
    private  final JobDetailsService jobDetailsService;


    public JobController(ClientSessionRepository clientSessionRepository, IClientAPISerretService clientAPISerretService, ExceptionResponseGenerator exceptionResponseGenerator, APIResponseUtils apiResponseUtils, PortalAPIEncodeDecodeUtils portalAPIEncodeDecodeUtils, CustomErrorCodeMessageUtils customErrorCodeMessageUtils, JobDetailsService jobDetailsService) {
        super( clientAPISerretService, clientSessionRepository,customErrorCodeMessageUtils);
        this.exceptionResponseGenerator = exceptionResponseGenerator;
        this.apiResponseUtils = apiResponseUtils;
        this.portalAPIEncodeDecodeUtils = portalAPIEncodeDecodeUtils;
        this.customErrorCodeMessageUtils = customErrorCodeMessageUtils;
        this.jobDetailsService = jobDetailsService;
    }

     @PostMapping("/createJob")
    public APIResponse createJob (@RequestBody @Valid APIRequest apiRequest, HttpServletRequest httpRequest)
            throws Exception {
         validateSessionId(httpRequest);
         Object object = null;
         try {
             object = portalAPIEncodeDecodeUtils.decryptObject(apiRequest, JobDetailsRequest.class);
             if (object instanceof CandidateRegistrationRequest) {
                 JobDetailsRequest jobDetailsRequest = (JobDetailsRequest) object;

                 JobDetailsResponse jobDetailsResponse = jobDetailsService.createJob(jobDetailsRequest);
                 return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                         ApplicationConstant.SUCCESS_200, jobDetailsResponse, null);

             } else {
                 log.error("login :: Invalid request");
                 return exceptionResponseGenerator.customErrorResponse(1, ApplicationConstant.INVALID_REQUEST);
             }
         } catch (
                 JsonProcessingException e) {
             log.error("login :: Failed to process request : {}", e.getMessage());
             return exceptionResponseGenerator.failedToProcessResponse();
         }
     }

    @GetMapping("/getAllJobs")
    public APIResponse getAllJobDetails(HttpServletRequest httpRequest,
                                             @RequestParam Optional<Integer> pageNumber,
                                             @RequestParam Optional<Integer> pageSize,
                                             @RequestParam(defaultValue = "false") boolean isRecent,
                                             @RequestParam Optional<Integer> days,
                                             @RequestParam(defaultValue = "ALL") List<String> jobStatus,
                                             @RequestParam(defaultValue = "false") String sortFlag,
                                             @RequestParam(defaultValue = "postedDate") String sortBy,
                                             @RequestParam Optional<String> search) {
        validateSessionId(httpRequest);
        PageResponse transactions = jobDetailsService.getAllJobDetails(pageSize, pageNumber, isRecent, days, jobStatus, sortFlag, sortBy, search);
        return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, transactions, null);
    }

    @GetMapping("/jobs/{jobId}")
    public APIResponse getJobDetailsById(@PathVariable Long jobId, HttpServletRequest httpRequest) {
        try {
            // Validate Authorization
            validateSessionId(httpRequest);
            // Fetch job details
            JobDetails jobDetails = jobDetailsService.getJobDetailsById(jobId);
            return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS,
                    ApplicationConstant.SUCCESS_200, jobDetails, null);
        } catch (Exception e) {
            log.error("Error fetching job details: {}", e.getMessage());
            return exceptionResponseGenerator.failedToProcessResponse();
        }
    }

    @GetMapping("/candidateListByJobId")
    public APIResponse getCandidateListByJobId( @RequestParam Long jobId,
                                                @RequestParam Optional<Integer> pageNumber,
                                                @RequestParam Optional<Integer> pageSize,
                                                @RequestParam(defaultValue = "false") boolean isRecent,
                                                @RequestParam Optional<Integer> days,
                                                @RequestParam(defaultValue = "false") String sortFlag,
                                                @RequestParam Optional<String> search,
                                                HttpServletRequest httpRequest) {
        validateSessionId(httpRequest);

        CandidateListResponse candidateListResponse = jobDetailsService.getCandidateListByJobId(jobId, pageNumber, pageSize, isRecent, days, sortFlag, search
        );

        return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, candidateListResponse, null
        );
    }

    @PutMapping("/update/jobs")
    public APIResponse getCandidateListByJobId( @RequestParam Long jobId,
                                                @RequestParam String days,HttpServletRequest httpRequest) {
        validateSessionId(httpRequest);
        String updatedExpiryDate = jobDetailsService.updateJobExpiryTime(jobId, days);
        return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, updatedExpiryDate, null);
    }

    @DeleteMapping("/deleteJob")
    public APIResponse deleteTheJob(@RequestParam Long jobId, HttpServletRequest httpRequest) {
        validateSessionId(httpRequest);

        String deleteMessage = jobDetailsService.deleteTheJob(jobId);
        return apiResponseUtils.generateExternalApiResponse(ApplicationConstant.SUCCESS, ApplicationConstant.SUCCESS_200, deleteMessage, null);
    }

}

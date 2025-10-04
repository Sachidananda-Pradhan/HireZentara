import axios from 'axios'
import { decryptPayload } from './encryptionAndDecryption'

const AUTH_HEADER = {
  Authorization: 'Basic eXlKcEF3ZEpzVkZQbXlGc1hjTFNEdzphMklqWXpGU1I3VHQ4d1ZfS2dEczlqVDJjS3A4d05KdlZ1eUEzYU5abHBz'
}
const BASE_URL = 'http://localhost:8080/hirezentara/api';


// generate captcha
export const getCaptcha = async () => {
  try {
    // Step 1: Call captcha API
    const res = await axios.get(`${BASE_URL}/admin/generate/captcha`, {
      headers: AUTH_HEADER,
    });
    const encryptedResponseData = res.data.encryptedResponseData;
    // Step 2: Decrypt the response
    const decrypted = await decryptPayload(encryptedResponseData);
    // Step 3: Extract captcha and sessionId
    const { captcha, sessionId } = decrypted;
    // Step 4: Convert base64 string to image
    const image = `data:image/png;base64,${captcha}`;
    return { image, sessionId };
  } catch (error) {
    console.error("Captcha fetch or decrypt failed:", error);
    throw error;
  }
};
//login
export const loginUser = async (encryptedRequestData, sessionId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/admin/login`,
      { encryptedRequestData },
      {
        headers: {
          'Session-Id': sessionId,
          'Content-Type': 'application/json',
          ...AUTH_HEADER
        }
      }
    )
    console.log(res.data);
    return res.data
  } catch (error) {
    // console.error('Login failed:', error)
    throw error
  }
}
// loggedUserDeatils 
  export const getLoggedInUserDetails = async (userName, sessionId) => {
    try{
  const response = await axios.get(`${BASE_URL}/admin/logged_admin_users_Details`,
    {
      params: { userName },
      headers: {
        'Session-Id': sessionId
      }
    }
  );
  return response.data;
  } catch (error) {
    console.error("API error :", error);
    throw error;
  }
};

// 🚪 Logout API
export const logoutUser = async (sessionId) => {
  try{
  const response = await axios.post(
    `${BASE_URL}/admin/admin-logout`,
    {}, // empty body
    {
      headers: {
        'Session-Id': sessionId
      }
    }
  );
  return response.data;
  } catch (error) {
    console.error("API error ", error);
    throw error;
  }
};

export const createJobPost = async (encryptedRequestData, sessionId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/job/createJob`,
      { encryptedRequestData }, // request body
      {
        headers: {
          "Session-Id": sessionId,
          "Content-Type": "application/json", // important for JSON payload
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API error in createJobPost:", error);
    throw error;
  }
};

// Fetch all jobs
export const getAllJobs = async (sessionId, params = {}) => {
  try {
    const defaultParams = {
      pageNumber: 0,
      pageSize: 10,
      isRecent: true,
      days: "",
      jobStatus: "",
      sortFlag: "",
      sortBy: "",
      search: "",
    };

    const queryParams = new URLSearchParams({ ...defaultParams, ...params }).toString();
    const response = await axios.get(`${BASE_URL}/job/getAllJobs?${queryParams}`, {
      headers: {
        "Session-Id": sessionId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching job list:", error);
    throw error;
  }
};

//update Job 
  export const updateJob = async (jobId, sessionId, days) => {
  try {
    const response = await axios.put(`${BASE_URL}/job/update/jobs`, '', {
      params: { jobId, days },
      headers: {
        'Session-Id': sessionId
      }
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

//Delete Job 
export const DeleteJobs = async (jobId, sessionId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/job/deleteJob`, {
      params: { jobId },
      headers: {
        'Session-Id': sessionId
      }
    });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

///getRegisteredCandidatesByJobId
export const getRegisteredCandidatesByJobId = async (sessionId , jobId, params = {}) => {
   try {
    const defaultParams = {
      jobId:jobId,
      pageNumber: 0,
      pageSize: 10,
      isRecent: true,
      days: "",
      sortFlag: "",
      search: "",
      sortBy: "",
      candidateStatus:"",
    };

    const queryParams = new URLSearchParams({ ...defaultParams, ...params }).toString();
    const response = await axios.get(`${BASE_URL}/job/candidateListByJobId?${queryParams}`, {
      headers: {
        "Session-Id": sessionId,
      },
    }
  );
  return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

//downloadCandidateListByJobId
export const downloadCandidateList = async (sessionId, jobId) => {
  try {
    const response = await axios.get(`${BASE_URL}/job/download-applied-candidates-by-job-id`, {
      params: { jobId },
      headers: {
        'Session-Id': sessionId
      },
      responseType: 'blob' // 👈 This tells Axios to treat the response as binary
    });
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

// delete the candiate 
export const deleteCandidateById = async (sessionId,candidateId) => {
  //debugger
  try {
    const response = await axios.delete(`${BASE_URL}/candidates/deleteCandidate`, {
      params: {candidateId},
      headers: {
        'Session-Id': sessionId
      },
      }
  );
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

// get candiate details

export const getCandidateByJobId = async (sessionId,candidateId) => {
  try {
    const response = await axios.get(`${BASE_URL}/candidates/getCandidate`, {
      params: {candidateId},
      headers: {
        'Session-Id': sessionId
      },
      }
  );
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

// update Candiate status

export const updateCandidateStatus = async (sessionId,candidateId,newStatus) => {
  try {
    const response = await axios.put(`${BASE_URL}/candidates/updateCandidateStatus`,{}, 
      {
        params: {
          candidateId,
          candidateStatus: newStatus // match your curl param name
        },
        headers: {
          'Session-Id': sessionId
        }
      }
  );
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const scheduleInterview = async (sessionId, candidateId, encryptedRequestData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/candidates/scheduleInterview`,
      { encryptedRequestData },  // here it’s only string now
      {
        params: { candidateId },
        headers: {
          "Session-Id": sessionId,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};



export const getInterviewSlots = async (sessionId,candidateId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/candidates/interviewSlots`,
      {
        params: {candidateId},
        headers: {
          'Session-Id': sessionId
        }
      }
    );
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const cancelInterview = async (sessionId,candidateId,interviewId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/candidates/cancelInterview`,
      {
        params: {candidateId,interviewId},
        headers: {
          'Session-Id': sessionId
        }
      }
    );
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

// reschudle
export const reScheduleInterview = async (sessionId, candidateId, encryptedRequestData,interviewId) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/candidates/reScheduleInterview`,
      { encryptedRequestData },  // here it’s only string now
      {
        params: {candidateId,interviewId },
        headers: {
          "Session-Id": sessionId,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};









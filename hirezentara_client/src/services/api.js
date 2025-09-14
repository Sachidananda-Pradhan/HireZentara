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
      days: 10,
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



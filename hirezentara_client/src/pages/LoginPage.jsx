import React, { useContext, useEffect, useState } from "react";
import { getCaptcha, loginUser } from "../services/api";
import {
  decryptPayload,
  encryptPayload,
} from "../services/encryptionAndDecryption";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { useDispatch } from "react-redux";
import { setSessionId, setUserDetails } from "../redux/userSlice";

const LoginPage = () => {
  const [captchaImg, setCaptchaImg] = useState("");
  // const [sessionId, setSessionId] = useState("");
    const [sessionId, setSessionIdState] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    captcha: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { loginUser, setSessionId,setUserDetails  } = useContext(AdminContext);

  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    try {
      const { image, sessionId } = await getCaptcha();
      setCaptchaImg(image);
      // setSessionId(sessionId);
            setSessionIdState(sessionId);

    } catch (error) {
      console.error("Failed to load captcha:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("input is ", formData);
//     try {
//       const encryptedRequestData = await encryptPayload(formData);
//       console.log("encryptedRequestData is ", encryptedRequestData);
//       const loginResponse = await loginUser(encryptedRequestData, sessionId);
//       //console.log( "login sucessfully");
//       const encryptedResponseData = loginResponse?.encryptedResponseData;
//       // console.log(encryptedResponseData);
      
//       if (!encryptedResponseData) {
//         // alert('Login failed: No encrypted response received.')
//         setError(error);
//         return;
//       }
//       const decrypted = await decryptPayload(encryptedResponseData);
//       // const { sessionId: newSessionId, message } = decrypted;
//             const { sessionId: newSessionId, message,  } = decrypted;

//              // ✅ Save sessionId + user details in Context
//       setSessionId(newSessionId);
//       setUserDetails({ userName: formData.userName });
//       console.log(formData.userName);
//       console.log(newSessionId.firstName);
      
      
//       console.log(decrypted);
      
//       // ✅ Store session ID for future API calls
//       //localStorage.setItem('sessionId', newSessionId)

//       // ✅ Show popup message
//       //alert(message || "Login successfully.");

//       // ✅ Redirect to dashboard
//       navigate("/dashboard")
// //         , {
// //   state: {
// //     sessionId: newSessionId,
// //     userName: formData.userName
// //   }
// // });
//     //  )

//     } catch (error) {
//       //alert('Login failed. Please try again.')
//       console.error("Login error:", error);
//       // const message = error?.response?.data?.message;
//       setError(error?.response?.data?.error.message);
//     }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const encryptedRequestData = await encryptPayload(formData);
    const loginResponse = await loginUser(encryptedRequestData, sessionId); // use local state
    const encryptedResponseData = loginResponse?.encryptedResponseData;

    if (!encryptedResponseData) {
      setError("Login failed: No encrypted response received.");
      return;
    }

    const decrypted = await decryptPayload(encryptedResponseData);
    const { sessionId: newSessionId, message, ...userData } = decrypted;

    // ✅ Save sessionId + user details in Redux
    dispatch(setSessionId(newSessionId));
    dispatch(setUserDetails({ ...userData, userName: formData.userName }));

    navigate("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    setError(error?.response?.data?.error?.message || "Login failed.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
            <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
 {/* {error.formData.userName && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error.formData.userName}
            </div>
          )} */}
        </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
 {/* {error.password && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error.password}
            </div>
          )} */}
          <div className="flex items-center justify-between">
            {captchaImg && (
              <img
                src={captchaImg}
                alt="captcha"
                className="h-12 w-auto border rounded shadow-sm"
              />
            )}
            <button
              type="button"
              onClick={loadCaptcha}
              className="text-sm text-indigo-600 hover:underline"
            >
              Refresh Captcha
            </button>
          </div>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            name="captcha"
            placeholder="Enter Captcha"
            value={formData.captcha}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

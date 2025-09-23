// import React, { useContext, useEffect, useState } from "react";
// import { getCaptcha, loginUser } from "../services/api";
// import {
//   decryptPayload,
//   encryptPayload,
// } from "../services/encryptionAndDecryption";
// import { useNavigate } from "react-router-dom";
// import { AdminContext } from "../context/AdminContext";
// import { useDispatch } from "react-redux";
// import { setSessionId, setUserDetails } from "../redux/userSlice";

// const LoginPage = () => {
//   const [captchaImg, setCaptchaImg] = useState("");
//   // const [sessionId, setSessionId] = useState("");
//     const [sessionId, setSessionIdState] = useState("");

//   const [formData, setFormData] = useState({
//     userName: "",
//     password: "",
//     captcha: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     loadCaptcha();
//   }, []);

//   const loadCaptcha = async () => {
//     try {
//       const { image, sessionId } = await getCaptcha();
//       setCaptchaImg(image);
//       // setSessionId(sessionId);
//             setSessionIdState(sessionId);

//     } catch (error) {
//       console.error("Failed to load captcha:", error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     const encryptedRequestData = await encryptPayload(formData);
//     const loginResponse = await loginUser(encryptedRequestData, sessionId); // use local state
//     const encryptedResponseData = loginResponse?.encryptedResponseData;

//     if (!encryptedResponseData) {
//       setError("Login failed: No encrypted response received.");
//       return;
//     }

//     const decrypted = await decryptPayload(encryptedResponseData);
//     const { sessionId: newSessionId, message, ...userData } = decrypted;

//     // ✅ Save sessionId + user details in Redux
//     dispatch(setSessionId(newSessionId));
//     dispatch(setUserDetails({ ...userData, userName: formData.userName }));

//     navigate("/dashboard");
//   } catch (error) {
//     console.error("Login error:", error);
//     setError(error?.response?.data?.error?.message || "Login failed.");
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
//       <div className="bg-white shadow-xl rounded-lg p-10 w-full max-w-md animate-fade-in">
//         <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
//           Login
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//             <input
//             type="text"
//             name="userName"
//             placeholder="Username"
//             value={formData.userName}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//         </div>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <div className="flex items-center justify-between">
//             {captchaImg && (
//               <img
//                 src={captchaImg}
//                 alt="captcha"
//                 className="h-12 w-auto border rounded shadow-sm"
//               />
//             )}
//             <button
//               type="button"
//               onClick={loadCaptcha}
//               className="text-sm text-indigo-600 hover:underline"
//             >
//               Refresh Captcha
//             </button>
//           </div>
//           {error && (
//             <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
//               {error}
//             </div>
//           )}

//           <input
//             type="text"
//             name="captcha"
//             placeholder="Enter Captcha"
//             value={formData.captcha}
//             onChange={handleChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             required
//           />

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

import React, { useContext, useEffect, useState } from "react";
import { getCaptcha, loginUser } from "../services/api";
import {
  decryptPayload,
  encryptPayload,
} from "../services/encryptionAndDecryption";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSessionId, setUserDetails } from "../redux/userSlice";
import { FiUser, FiLock, FiRefreshCw, FiEye, FiEyeOff, FiLogIn, FiShield } from "react-icons/fi";

const LoginPage = () => {
  const [captchaImg, setCaptchaImg] = useState("");
  const [sessionId, setSessionIdState] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    captcha: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      const { image, sessionId } = await getCaptcha();
      setCaptchaImg(image);
      setSessionIdState(sessionId);
      setFormData(prev => ({ ...prev, captcha: "" })); // Clear captcha input
    } catch (error) {
      console.error("Failed to load captcha:", error);
      setError("Failed to load captcha. Please try again.");
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const encryptedRequestData = await encryptPayload(formData);
      const loginResponse = await loginUser(encryptedRequestData, sessionId);
      const encryptedResponseData = loginResponse?.encryptedResponseData;

      if (!encryptedResponseData) {
        setError("Login failed: No encrypted response received.");
        return;
      }

      const decrypted = await decryptPayload(encryptedResponseData);
      const { sessionId: newSessionId, message, ...userData } = decrypted;

      // Save sessionId + user details in Redux
      dispatch(setSessionId(newSessionId));
      dispatch(setUserDetails({ ...userData, userName: formData.userName }));

      // Success animation before navigation
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);

    } catch (error) {
      console.error("Login error:", error);
      setError(error?.response?.data?.error?.message || "Login failed. Please check your credentials.");
      loadCaptcha(); // Reload captcha on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div> */}
        {/* <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div> */}
        {/* <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div> */}
      </div>

      {/* Floating Particles */}
      {/* <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div> */}

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          {/* <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl ring-4 ring-white/20">
            <FiShield className="w-10 h-10 text-white" />
          </div> */}
          {/* <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1> */}
          {/* <p className="text-gray-300">Sign in to your account to continue</p> */}
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="relative group">
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-300" />
              <input
                type="text"
                name="userName"
                placeholder="Username"
                value={formData.userName}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors duration-300" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Captcha Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4 border border-white/20">
                <div className="flex-1">
                  {captchaImg ? (
                    <img
                      src={captchaImg}
                      alt="captcha"
                      className="h-14 w-auto rounded-lg shadow-lg bg-white p-1"
                    />
                  ) : (
                    <div className="h-14 w-32 bg-white/20 rounded-lg animate-pulse flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Loading...</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={loadCaptcha}
                  disabled={captchaLoading}
                  className="ml-4 p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiRefreshCw className={`w-5 h-5 ${captchaLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Captcha Input */}
              <div className="relative">
                <input
                  type="text"
                  name="captcha"
                  placeholder="Enter Captcha Code"
                  value={formData.captcha}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-center font-mono text-lg tracking-widest"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm animate-shake">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Additional Options */}
          {/* <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <button className="text-gray-300 hover:text-white transition-colors duration-300">
                Forgot Password?
              </button>
              <div className="w-px h-4 bg-gray-600"></div>
              <button className="text-gray-300 hover:text-white transition-colors duration-300">
                Need Help?
              </button>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>© 2025 Your Company. All rights reserved.</p>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure Login</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
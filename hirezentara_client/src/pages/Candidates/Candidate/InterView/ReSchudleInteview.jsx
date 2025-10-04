// import React, { useState, useEffect } from "react";
// import { CiCalendar, CiLock, CiMail, CiUser } from "react-icons/ci";
// import { FiAlertCircle, FiCheckCircle, FiRefreshCw, FiRotateCcw, FiVideo, FiX } from "react-icons/fi";
 
// const RescheduleInterview = ({
//   interview,
//   sessionId,
//   setMeetings,
//   onRescheduleOpen,
// }) => {
//   const [showRescheduleModal, setShowRescheduleModal] = useState(false);
//   const [meetingDetails, setMeetingDetails] = useState({
//     interviewType: "",
//     interviewDate: "",
//     interviewStartTime: "",
//     interviewEndTime: "",
//     meetingPlatform: "",
//     interviewName: "",
//     interviewEmail: "",
//     interviewTimeInHR: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const interviewTypes = [
//     { value: "Phone Screening", label: "Phone Screening", icon: "📞" },
//     { value: "Technical Interview", label: "Technical Interview", icon: "💻" },
//     { value: "Behavioral Interview", label: "Behavioral Interview", icon: "🤝" },
//     { value: "Final Interview", label: "Final Interview", icon: "🎯" },
//   ];

//   const meetingPlatforms = [
//     { value: "Zoom", label: "Zoom", icon: "🔵" },
//     { value: "Microsoft Teams", label: "microsoft teams", icon: "🟣" },
//     { value: "Google Meet", label: "Google Meet", icon: "🟢" },
//     { value: "In-Person", label: "In-Person", icon: "🏢" },
//   ];

//   useEffect(() => {
//     if (showRescheduleModal) {
//       setMeetingDetails({
//         interviewType: interview.interviewType || "",
//         interviewDate: interview.interviewDate || "",
//         interviewStartTime: interview.interviewStartTime || "",
//         interviewEndTime: interview.interviewEndTime || "",
//         meetingPlatform: interview.meetingPlatform || "",
//         interviewName: interview.interviewName || "",
//         interviewEmail: interview.interviewEmail || "",
//         interviewTimeInHR: interview.interviewTimeInHR || "",
//       });
//       setErrors({});
//     }
//   }, [showRescheduleModal, interview]);

//   const openRescheduleModal = () => {
//     setShowRescheduleModal(true);
//     if (onRescheduleOpen && typeof onRescheduleOpen === "function") {
//       onRescheduleOpen(interview);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setMeetingDetails((prev) => {
//       const updated = { ...prev, [name]: value };

//       if (name === "interviewStartTime" || name === "interviewEndTime") {
//         if (updated.interviewStartTime && updated.interviewEndTime) {
//           const start = new Date(`1970-01-01T${updated.interviewStartTime}:00`);
//           const end = new Date(`1970-01-01T${updated.interviewEndTime}:00`);
//           const duration = (end - start) / (1000 * 60 * 60);
//           if (duration > 0) {
//             updated.interviewTimeInHR = duration.toFixed(1);
//           } else {
//             updated.interviewTimeInHR = "";
//           }
//         }
//       }

//       return updated;
//     });
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!meetingDetails.interviewType) newErrors.interviewType = "Interview type is required";
//     if (!meetingDetails.interviewDate) newErrors.interviewDate = "Date is required";
//     if (!meetingDetails.interviewStartTime) newErrors.interviewStartTime = "Start time is required";
//     if (!meetingDetails.interviewEndTime) newErrors.interviewEndTime = "End time is required";
//     if (!meetingDetails.meetingPlatform) newErrors.meetingPlatform = "Platform is required";
//     if (!meetingDetails.interviewName) newErrors.interviewName = "Interviewer name is required";
//     if (!meetingDetails.interviewEmail) newErrors.interviewEmail = "Interviewer email is required";

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (meetingDetails.interviewEmail && !emailRegex.test(meetingDetails.interviewEmail)) {
//       newErrors.interviewEmail = "Please enter a valid email address";
//     }

//     // Time validation
//     if (meetingDetails.interviewStartTime && meetingDetails.interviewEndTime) {
//       const start = new Date(`1970-01-01T${meetingDetails.interviewStartTime}:00`);
//       const end = new Date(`1970-01-01T${meetingDetails.interviewEndTime}:00`);
//       if (end <= start) {
//         newErrors.interviewEndTime = "End time must be after start time";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleReschedule = async () => {
//     if (!validateForm()) return;
//     setIsLoading(true);
//     try {
//       // Simulate API call for demo
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       const updatedMeeting = {
//         ...interview,
//         ...meetingDetails,
//         status: "RESCHEDULED",
//       };

//       setMeetings((prev) =>
//         prev.map((m) =>
//           m.interviewId === interview.interviewId ? updatedMeeting : m
//         )
//       );
//       setShowRescheduleModal(false);
//     } catch (error) {
//       console.error("Rescheduling failed:", error);
//       alert("Failed to reschedule interview. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const FormField = ({ label, error, icon, children, required = false }) => (
//     <div className="space-y-2">
//       <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//         {icon}
//         {label}
//         {required && <span className="text-red-500">*</span>}
//       </label>
//       {children}
//       {error && (
//         <div className="flex items-center gap-1 text-red-600 text-xs">
//           <FiAlertCircle className="w-3 h-3" />
//           {error}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <button
//         type="button"
//         className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//         onClick={openRescheduleModal}
//         aria-label={`Reschedule ${interview.interviewType} interview`}
//         disabled={isLoading}
//       >
//         <FiRefreshCw className="w-4 h-4" />
//         Reschedule
//       </button>

//       {showRescheduleModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-emerald-100 rounded-xl">
//                   <FiRotateCcw className="w-5 h-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">Reschedule Interview</h2>
//                   <p className="text-sm text-gray-500">
//                     Update details for {interview.interviewType}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowRescheduleModal(false)}
//                 className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//                 disabled={isLoading}
//               >
//                 <FiX className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             {/* Current Details Banner */}
//             <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
//               <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
//                 <CiCalendar className="w-4 h-4 text-blue-600" />
//                 Current Schedule
//               </h3>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-600">Date:</span>
//                   <span className="ml-2 font-medium">{interview.interviewDate
//                         ? new Date(interview.interviewDate).toLocaleDateString(
//                             "en-US",
//                             {
//                               month: "long",
//                               day: "numeric",
//                               year: "numeric",
//                             }
//                           )
//                         : "Date not available"}{" "}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Time:</span>
//                   <span className="ml-2 font-medium">{interview.interviewStartTime}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">Platform:</span>
//                   <span className="ml-2 font-medium">{interview.meetingPlatform}</span>
//                 </div>
//                 <div>
//                   <span className="text-gray-600">InterviewType:</span>
//                   <span className="ml-2 font-medium">{interview.interviewType}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Form Content */}
//             <div className="p-6 space-y-6">
//               {/* Interview Type & Date */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   label="Interview Type"
//                   error={errors.interviewType}
//                   icon="🎯"
//                   required
//                 >
//                   <select
//                     name="interviewType"
//                     value={meetingDetails.interviewType}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                   >
//                     <option value="">Select interview type</option>
//                     {interviewTypes.map((type) => (
//                       <option key={type.value} value={type.value}>
//                         {type.icon} {type.label}
//                       </option>
//                     ))}
//                   </select>
//                 </FormField>

//                 <FormField
//                   label="New Interview Date"
//                   error={errors.interviewDate}
//                   icon={<CiCalendar className="w-4 h-4 text-blue-600" />}
//                   required
//                 >
//                   <input
//                     type="date"
//                     name="interviewDate"
//                     value={meetingDetails.interviewDate}
//                     onChange={handleChange}
//                     min={new Date().toISOString().split('T')[0]}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                   />
//                 </FormField>
//               </div>

//               {/* Time Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <FormField
//                   label="Start Time"
//                   error={errors.interviewStartTime}
//                   icon={<CiLock className="w-4 h-4 text-green-600" />}
//                   required
//                 >
//                   <input
//                     type="time"
//                     name="interviewStartTime"
//                     value={meetingDetails.interviewStartTime}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                   />
//                 </FormField>

//                 <FormField
//                   label="End Time"
//                   error={errors.interviewEndTime}
//                   icon={<CiLock className="w-4 h-4 text-red-600" />}
//                   required
//                 >
//                   <input
//                     type="time"
//                     name="interviewEndTime"
//                     value={meetingDetails.interviewEndTime}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                   />
//                 </FormField>

//                 <FormField
//                   label="Duration"
//                   icon={<CiLock className="w-4 h-4 text-purple-600" />}
//                 >
//                   <input
//                     type="text"
//                     value={meetingDetails.interviewTimeInHR ? `${meetingDetails.interviewTimeInHR} hrs` : ""}
//                     readOnly
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
//                     placeholder="Auto-calculated"
//                   />
//                 </FormField>
//               </div>

//               {/* Platform */}
//               <FormField
//                 label="Meeting Platform"
//                 error={errors.meetingPlatform}
//                 icon={<FiVideo className="w-4 h-4 text-blue-600" />}
//                 required
//               >
//                 <select
//                   name="meetingPlatform"
//                   value={meetingDetails.meetingPlatform}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                 >
//                   <option value="">Select meeting platform</option>
//                   {meetingPlatforms.map((platform) => (
//                     <option key={platform.value} value={platform.value}>
//                       {platform.icon} {platform.label}
//                     </option>
//                   ))}
//                 </select>
//               </FormField>

//               {/* Interviewer Details */}
//               <div className="bg-gray-50 rounded-xl p-4 space-y-4">
//                 <h3 className="font-semibold text-gray-800 flex items-center gap-2">
//                   <CiUser className="w-4 h-4" />
//                   Interviewer Details
//                 </h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <FormField
//                     label="Interviewer Name"
//                     error={errors.interviewName}
//                     icon={<CiUser className="w-4 h-4 text-indigo-600" />}
//                     required
//                   >
//                     <input
//                       type="text"
//                       name="interviewName"
//                       value={meetingDetails.interviewName}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                       placeholder="e.g., John Doe"
//                     />
//                   </FormField>

//                   <FormField
//                     label="Interviewer Email"
//                     error={errors.interviewEmail}
//                     icon={<CiMail className="w-4 h-4 text-red-600" />}
//                     required
//                   >
//                     <input
//                       type="email"
//                       name="interviewEmail"
//                       value={meetingDetails.interviewEmail}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
//                       placeholder="john.doe@company.com"
//                     />
//                   </FormField>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={() => setShowRescheduleModal(false)}
//                 className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleReschedule}
//                 className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Rescheduling...
//                   </>
//                 ) : (
//                   <>
//                     <FiCheckCircle className="w-4 h-4" />
//                     Reschedule Interview
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default RescheduleInterview;


import React, { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import InterviewFormModal from "./InterviewFormModal"; 
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { decryptPayload, encryptPayload } from "../../../../services/encryptionAndDecryption";
import { reScheduleInterview } from "../../../../services/api";

const RescheduleInterview = ({
  interview,
  sessionId,
  setMeetings,
  onRescheduleOpen,
}) => {
//   const [showRescheduleModal, setShowRescheduleModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const sessionId = useSelector((state) => state.user.sessionId);
//   const { candidateId } = useParams();
//   const interviewId=interview.interviewId;
   

//   const openRescheduleModal = () => {
//     setShowRescheduleModal(true);
//     if (onRescheduleOpen && typeof onRescheduleOpen === "function") {
//       onRescheduleOpen(interview);
//     }
//   };

//   const handleRescheduleSubmit = async (formData) => {
//     setIsLoading(true);
//     try {
//      setMeetings(formData);
           
//           const encryptedRequestData = await encryptPayload(formData);
//           const response = await reScheduleInterview(sessionId, candidateId, encryptedRequestData,interviewId);
//           const encryptedResponseData = response?.data?.encryptedResponseData;
//           const decrypted = await decryptPayload(encryptedResponseData);
//       const updatedMeeting = {
//         ...interview,
//         ...formData,
//         // Map form field names to match your data structure
//         interviewType: formData.interviewtype, // Note: mapping interviewtype to interviewType
//         status: "RESCHEDULED",
//       };

//       setMeetings((prev) =>
//         prev.map((m) =>
//           m.interviewId === interview.interviewId ? updatedMeeting : m
//         )
//       );
//       setShowRescheduleModal(false);
//     } catch (error) {
//       console.error("Rescheduling failed:", error);
//       alert("Failed to reschedule interview. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <button
//         type="button"
//         className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//         onClick={openRescheduleModal}
//         aria-label={`Reschedule ${interview.interviewType} interview`}
//         disabled={isLoading}
//       >
//         <FiRefreshCw className="w-4 h-4" />
//         Reschedule
//       </button>

//       {/* Use the unified InterviewFormModal */}
//       <InterviewFormModal
//         isOpen={showRescheduleModal}
//         onClose={() => setShowRescheduleModal(false)}
//         onSubmit={handleRescheduleSubmit}
//         initialData={{
//           interviewtype: interview.interviewType, // Note: mapping interviewType to interviewtype
//           interviewRound: interview.interviewRound,
//           interviewDate: interview.interviewDate,
//           interviewStartTime: interview.interviewStartTime,
//           interviewEndTime: interview.interviewEndTime,
//           interviewTimeInHR: interview.interviewTimeInHR,
//           meetingPlatform: interview.meetingPlatform,
//           interviewName: interview.interviewName,
//           interviewEmail: interview.interviewEmail,
//         }}
//         mode="reschedule"
//         currentScheduleInfo={interview}
//         isLoading={isLoading}
//       />
//     </>
//   );
// };

// export default RescheduleInterview;
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { candidateId } = useParams();
  const interviewId = interview.interviewId;

  const openRescheduleModal = () => {
    setShowRescheduleModal(true);
    if (onRescheduleOpen && typeof onRescheduleOpen === "function") {
      onRescheduleOpen(interview);
    }
  };

  const handleRescheduleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const encryptedRequestData = await encryptPayload(formData);
      const response = await reScheduleInterview(sessionId,candidateId,encryptedRequestData,interviewId);
      const responseData = response?.data?.encryptedResponseData;
      const decrypted = await decryptPayload(responseData);

      const updatedMeeting = {
        ...interview,
        ...formData,
        interviewType: formData.interviewtype,
        status: "RESCHEDULED",
      };

      setMeetings((prev) =>
        prev.map((m) =>
          m.interviewId === interview.interviewId ? updatedMeeting : m
        )
      );
      setShowRescheduleModal(false);
    } catch (error) {
      console.error("Rescheduling failed:", error);
      alert("Failed to reschedule interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        onClick={openRescheduleModal}
        aria-label={`Reschedule ${interview.interviewType} interview`}
        disabled={isLoading}
      >
        <FiRefreshCw className="w-4 h-4" />
        Reschedule
      </button>

      <InterviewFormModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onSubmit={handleRescheduleSubmit}
        initialData={{
          interviewtype: interview.interviewType,
          interviewRound: interview.interviewRound,
          interviewDate: interview.interviewDate,
          interviewStartTime: interview.interviewStartTime,
          interviewEndTime: interview.interviewEndTime,
          interviewTimeInHR: interview.interviewTimeInHR,
          meetingPlatform: interview.meetingPlatform,
          interviewName: interview.interviewName,
          interviewEmail: interview.interviewEmail,
        }}
        mode="reschedule"
        currentScheduleInfo={interview}
        isLoading={isLoading}
      />
    </>
  );
};

export default RescheduleInterview;
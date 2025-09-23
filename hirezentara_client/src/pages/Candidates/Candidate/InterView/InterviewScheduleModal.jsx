// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { encryptPayload } from "../../../../services/encryptionAndDecryption";
// import { scheduleInterview } from "../../../../services/api";
// import { CiClock1 } from "react-icons/ci";

// const InterviewScheduleModal = ({
//   newMeeting,
//   setNewMeeting,
//   setShowScheduleModal,
//   onMeetingScheduled,
// }) => {
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const sessionId = useSelector((state) => state.user.sessionId);
//   const { candidateId } = useParams();

//   const interviewTypes = [
//     "Phone Screening",
//     "Technical Interview",
//     "Behavioral Interview",
//     "Final Interview",
//   ];
//   const meetingPlatforms = ["Zoom", "microsoft teams", "Google Meet", "In-Person"];

//    const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewMeeting((prev) => {
//       const updated = { ...prev, [name]: value };

//       // Auto-calculate duration when start/end times change
//       if (name === "interviewStartTime" || name === "interviewEndTime") {
//         if (updated.interviewStartTime && updated.interviewEndTime) {
//           const start = new Date(`1970-01-01T${updated.interviewStartTime}:00`);
//           const end = new Date(`1970-01-01T${updated.interviewEndTime}:00`);
//           const duration = (end - start) / (1000 * 60 * 60); // in hours
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
//     if (!newMeeting.interviewtype) newErrors.interviewtype = "Required";
//     if (!newMeeting.interviewDate) newErrors.interviewDate = "Required";
//     if (!newMeeting.interviewStartTime) newErrors.interviewStartTime = "Required";
//     if (!newMeeting.interviewEndTime) newErrors.interviewEndTime = "Required";
//     if (!newMeeting.meetingPlatform) newErrors.meetingPlatform = "Required";
//     if (!newMeeting.interviewName) newErrors.interviewName = "Required";
//     if (!newMeeting.interviewEmail) newErrors.interviewEmail = "Required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
//     try {
//       setIsLoading(true);
//        const encryptedRequestData = await encryptPayload(newMeeting);
//       const response = await scheduleInterview(sessionId, candidateId,encryptedRequestData);
//       onMeetingScheduled({
//         id: response.data?.interviewId || Date.now(),
//         ...newMeeting,
//         status: "Scheduled",
//       });
//       setShowScheduleModal(false);
//     } catch (err) {
//       console.error("Error scheduling interview:", err);
//       alert("Failed to schedule interview");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center  bg-opacity-40">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
//         <h3 className="text-lg font-semibold mb-4">Schedule Interview</h3>

//         {/* Interview Type */}
//         <div className="mb-3">
//           <label className="block text-sm font-medium mb-1">Interview Type</label>
//           <select
//             name="interviewtype"
//             value={newMeeting.interviewtype}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           >
//             <option value="">Select type</option>
//             {interviewTypes.map((t) => (
//               <option key={t} value={t}>{t}</option>
//             ))}
//           </select>
//           {errors.interviewtype && <p className="text-red-500 text-xs">{errors.interviewtype}</p>}
//         </div>

//         {/* Round */}
//         <div className="mb-3">
//           <label className="block text-sm font-medium mb-1">Interview Round</label>
//           <input
//             type="text"
//             name="interviewRound"
//             value={newMeeting.interviewRound}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//             placeholder="e.g., Round 1"
//           />
//         </div>

//         {/* Date */}
//         <div className="mb-3">
//           <label className="block text-sm font-medium mb-1">Date</label>
//           <input
//             type="date"
//             name="interviewDate"
//             value={newMeeting.interviewDate}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           />
//           {errors.interviewDate && <p className="text-red-500 text-xs">{errors.interviewDate}</p>}
//         </div>

//         {/* Start / End Time */}
//         <div className="flex space-x-2 mb-3">
//           <div className="flex-1">
//             <label className="block text-sm font-medium mb-1">Start Time</label>
//             <input
//               type="time"
//               name="interviewStartTime"
//               value={newMeeting.interviewStartTime}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2"
//             />
//             {errors.interviewStartTime && (
//               <p className="text-red-500 text-xs">{errors.interviewStartTime}</p>
//             )}
//           </div>
//           <div className="flex-1">
//             <label className="block text-sm font-medium mb-1">End Time</label>
//             <input
//               type="time"
//               name="interviewEndTime"
//               value={newMeeting.interviewEndTime}
//               onChange={handleChange}
//               className="w-full border rounded px-3 py-2"
//             />
//             {errors.interviewEndTime && (
//               <p className="text-red-500 text-xs">{errors.interviewEndTime}</p>
//             )}
//           </div>
//         </div>

//          {/* Duration */}
//         <div className="mb-3">
//           <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
//             <CiClock1 className="w-4 h-4" />
//             <span>Duration (hours)</span>
//           </label>
//           <input
//             type="text"
//             name="interviewTimeInHR"
//             value={newMeeting.interviewTimeInHR || ""}
//             readOnly
//             className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
//             placeholder="Calculated automatically"
//           />
//         </div>

//         {/* Platform */}
//         <div className="mb-3">
//           <label className="block text-sm font-medium mb-1">Platform</label>
//           <select
//             name="meetingPlatform"
//             value={newMeeting.meetingPlatform}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//           >
//             <option value="">Select platform</option>
//             {meetingPlatforms.map((p) => (
//               <option key={p} value={p}>{p}</option>
//             ))}
//           </select>
//         </div>

//         {/* Interviewer */}
//         <div className="mb-3">
//           <label className="block text-sm font-medium mb-1">Interviewer Name</label>
//           <input
//             type="text"
//             name="interviewName"
//             value={newMeeting.interviewName}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//             placeholder="e.g., John Doe"
//           />
//         </div>

//         <div className="mb-3">
//           <label className="block text-sm font-medium mb-1">Interviewer Email</label>
//           <input
//             type="email"
//             name="interviewEmail"
//             value={newMeeting.interviewEmail}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2"
//             placeholder="e.g., john@example.com"
//           />
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end space-x-3 mt-4">
//           <button
//             onClick={() => setShowScheduleModal(false)}
//             className="px-4 py-2 bg-gray-200 rounded"
//             disabled={isLoading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//             disabled={isLoading}
//           >
//             {isLoading ? "Scheduling..." : "Schedule"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewScheduleModal;

// import React, { useState } from "react";
// import { CiCalendar, CiLock, CiMail, CiUser } from "react-icons/ci";
// import { FiAlertCircle, FiCheckCircle, FiVideo, FiX } from "react-icons/fi";
// import { encryptPayload } from "../../../../services/encryptionAndDecryption";
// import { scheduleInterview } from "../../../../services/api";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";


// const InterviewScheduleModal = ({
//   newMeeting,
//   setNewMeeting,
//   setShowScheduleModal,
//   onMeetingScheduled,
// }) => {
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const sessionId = useSelector((state) => state.user.sessionId);
//   const { candidateId } = useParams();

//   const interviewTypes = [
//     { value: "Phone Screening", label: "Phone Screening", icon: "📞" },
//     { value: "Technical Interview", label: "Technical Interview", icon: "💻" },
//     { value: "Behavioral Interview", label: "Behavioral Interview", icon: "🤝" },
//     { value: "Final Interview", label: "Final Interview", icon: "🎯" },
//   ];

//   const meetingPlatforms = [
//     { value: "Zoom", label: "Zoom", icon: "🔵" },
//     { value: "microsoft teams", label: "Microsoft Teams", icon: "🟣" },
//     { value: "Google Meet", label: "Google Meet", icon: "🟢" },
//     { value: "In-Person", label: "In-Person", icon: "🏢" },
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setNewMeeting((prev) => {
//       const updated = { ...prev, [name]: value };

//       // Auto-calculate duration when start/end times change
//       if (name === "interviewStartTime" || name === "interviewEndTime") {
//         if (updated.interviewStartTime && updated.interviewEndTime) {
//           const start = new Date(`1970-01-01T${updated.interviewStartTime}:00`);
//           const end = new Date(`1970-01-01T${updated.interviewEndTime}:00`);
//           const duration = (end - start) / (1000 * 60 * 60); // in hours
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
//     if (!newMeeting.interviewtype) newErrors.interviewtype = "Interview type is required";
//     if (!newMeeting.interviewDate) newErrors.interviewDate = "Date is required";
//     if (!newMeeting.interviewStartTime) newErrors.interviewStartTime = "Start time is required";
//     if (!newMeeting.interviewEndTime) newErrors.interviewEndTime = "End time is required";
//     if (!newMeeting.meetingPlatform) newErrors.meetingPlatform = "Platform is required";
//     if (!newMeeting.interviewName) newErrors.interviewName = "Interviewer name is required";
//     if (!newMeeting.interviewEmail) newErrors.interviewEmail = "Interviewer email is required";
    
//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (newMeeting.interviewEmail && !emailRegex.test(newMeeting.interviewEmail)) {
//       newErrors.interviewEmail = "Please enter a valid email address";
//     }

//     // Time validation
//     if (newMeeting.interviewStartTime && newMeeting.interviewEndTime) {
//       const start = new Date(`1970-01-01T${newMeeting.interviewStartTime}:00`);
//       const end = new Date(`1970-01-01T${newMeeting.interviewEndTime}:00`);
//       if (end <= start) {
//         newErrors.interviewEndTime = "End time must be after start time";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
//     try {
//       setIsLoading(true);
//       // Simulate API call for demo
//        const encryptedRequestData = await encryptPayload(newMeeting);
//       const response = await scheduleInterview(sessionId, candidateId,encryptedRequestData);
//     onMeetingScheduled({
//        id: response.data?.interviewId || Date.now(),
//        ...newMeeting,
//        status: "Scheduled",
//     });
//       setShowScheduleModal(false);
//     } catch (err) {
//       console.error("Error scheduling interview:", err);
//       alert("Failed to schedule interview. Please try again.");
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
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-100 rounded-xl">
//               <CiCalendar className="w-5 h-5 text-blue-600" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-900">Schedule Interview</h2>
//           </div>
//           <button
//             onClick={() => setShowScheduleModal(false)}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
//             disabled={isLoading}
//           >
//             <FiX className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Form Content */}
//         <div className="p-6 space-y-6">
//           {/* Interview Type & Round */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <FormField
//               label="Interview Type"
//               error={errors.interviewtype}
//               icon="🎯"
//               required
//             >
//               <select
//                 name="interviewtype"
//                 value={newMeeting.interviewtype}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               >
//                 <option value="">Select interview type</option>
//                 {interviewTypes.map((type) => (
//                   <option key={type.value} value={type.value}>
//                     {type.icon} {type.label}
//                   </option>
//                 ))}
//               </select>
//             </FormField>

//             <FormField
//               label="Interview Round"
//               icon="🔢"
//             >
//               <input
//                 type="text"
//                 name="interviewRound"
//                 value={newMeeting.interviewRound || ""}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 placeholder="e.g., Round 1"
//               />
//             </FormField>
//           </div>

//           {/* Date */}
//           <FormField
//             label="Interview Date"
//             error={errors.interviewDate}
//             icon={<CiCalendar className="w-4 h-4 text-blue-600" />}
//             required
//           >
//             <input
//               type="date"
//               name="interviewDate"
//               value={newMeeting.interviewDate}
//               onChange={handleChange}
//               min={new Date().toISOString().split('T')[0]}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             />
//           </FormField>

//           {/* Time Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <FormField
//               label="Start Time"
//               error={errors.interviewStartTime}
//               icon={<CiLock className="w-4 h-4 text-green-600" />}
//               required
//             >
//               <input
//                 type="time"
//                 name="interviewStartTime"
//                 value={newMeeting.interviewStartTime}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               />
//             </FormField>

//             <FormField
//               label="End Time"
//               error={errors.interviewEndTime}
//               icon={<CiLock className="w-4 h-4 text-red-600" />}
//               required
//             >
//               <input
//                 type="time"
//                 name="interviewEndTime"
//                 value={newMeeting.interviewEndTime}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               />
//             </FormField>

//             <FormField
//               label="Duration"
//               icon={<CiLock className="w-4 h-4 text-purple-600" />}
//             >
//               <div className="relative">
//                 <input
//                   type="text"
//                   name="interviewTimeInHR"
//                   value={newMeeting.interviewTimeInHR ? `${newMeeting.interviewTimeInHR} hrs` : ""}
//                   readOnly
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
//                   placeholder="Auto-calculated"
//                 />
//               </div>
//             </FormField>
//           </div>

//           {/* Platform */}
//           <FormField
//             label="Meeting Platform"
//             error={errors.meetingPlatform}
//             icon={<FiVideo className="w-4 h-4 text-blue-600" />}
//             required
//           >
//             <select
//               name="meetingPlatform"
//               value={newMeeting.meetingPlatform}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//             >
//               <option value="">Select meeting platform</option>
//               {meetingPlatforms.map((platform) => (
//                 <option key={platform.value} value={platform.value}>
//                   {platform.icon} {platform.label}
//                 </option>
//               ))}
//             </select>
//           </FormField>

//           {/* Interviewer Details */}
//           <div className="bg-gray-50 rounded-xl p-4 space-y-4">
//             <h3 className="font-semibold text-gray-800 flex items-center gap-2">
//               <CiUser className="w-4 h-4" />
//               Interviewer Details
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 label="Interviewer Name"
//                 error={errors.interviewName}
//                 icon={<CiUser className="w-4 h-4 text-indigo-600" />}
//                 required
//               >
//                 <input
//                   type="text"
//                   name="interviewName"
//                   value={newMeeting.interviewName}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   placeholder="e.g., John Doe"
//                 />
//               </FormField>

//               <FormField
//                 label="Interviewer Email"
//                 error={errors.interviewEmail}
//                 icon={<CiMail className="w-4 h-4 text-red-600" />}
//                 required
//               >
//                 <input
//                   type="email"
//                   name="interviewEmail"
//                   value={newMeeting.interviewEmail}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   placeholder="john.doe@company.com"
//                 />
//               </FormField>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
//           <button
//             onClick={() => setShowScheduleModal(false)}
//             className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
//             disabled={isLoading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Scheduling...
//               </>
//             ) : (
//               <>
//                 <FiCheckCircle className="w-4 h-4" />
//                 Schedule Interview
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InterviewScheduleModal;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { encryptPayload } from "../../../../services/encryptionAndDecryption";
import { scheduleInterview } from "../../../../services/api";
import InterviewFormModal from "./InterviewFormModal"; 

const InterviewScheduleModal = ({
  newMeeting,
  setNewMeeting,
  setShowScheduleModal,
  onMeetingScheduled,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const sessionId = useSelector((state) => state.user.sessionId);
  const { candidateId } = useParams();

  const handleScheduleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      // Update the parent component's state with the form data
      setNewMeeting(formData);
      
      const encryptedRequestData = await encryptPayload(formData);
      const response = await scheduleInterview(sessionId, candidateId, encryptedRequestData);
      
      onMeetingScheduled({
        id: response.data?.interviewId || Date.now(),
        ...formData,
        // Map form field names to match your data structure
        interviewType: formData.interviewtype, // Map interviewtype to interviewType
        status: "Scheduled",
      });
      
      setShowScheduleModal(false);
    } catch (err) {
      console.error("Error scheduling interview:", err);
      alert("Failed to schedule interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InterviewFormModal
      isOpen={true} // Always open when this component renders
      onClose={() => setShowScheduleModal(false)}
      onSubmit={handleScheduleSubmit}
      initialData={newMeeting}
      mode="schedule"
      isLoading={isLoading}
    />
  );
};

export default InterviewScheduleModal;
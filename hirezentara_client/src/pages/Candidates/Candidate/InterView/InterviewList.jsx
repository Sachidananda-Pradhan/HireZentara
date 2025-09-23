// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import { IoTimeOutline } from 'react-icons/io5';
// import { MdVideoCall } from 'react-icons/md';
// import { decryptPayload } from '../../../../services/encryptionAndDecryption';
// import { getInterviewSlots } from '../../../../services/api';
// import InterviewScheduleModal from './InterviewScheduleModal';
// import CancelInterview from './CancelInterview';
// import RescheduleInterview from './ReSchudleInteview';

// const InterviewList = ({ setSelectedTab, candidateData }) => {
//   const [meetings, setMeetings] = useState([]);
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [showRescheduleModal, setShowRescheduleModal] = useState(false);
//   const [selectedInterview, setSelectedInterview] = useState(null);
//   const [newMeeting, setNewMeeting] = useState({
//     interviewtype: '',
//     interviewRound: '',
//     interviewDate: '',
//     interviewStartTime: '',
//     interviewEndTime: '',
//     interviewTimeInHR: '',
//     meetingPlatform: '',
//     interviewName: '',
//     interviewEmail: '',
//   });

//   const sessionId = useSelector((state) => state.user.sessionId);
//   const { candidateId } = useParams();

//   // Fetch interviews data
//   useEffect(() => {
//     const fetchInterviews = async () => {
//       try {
//         const response = await getInterviewSlots(sessionId, candidateId);
//         const encryptedResponseData = response?.data?.encryptedResponseData;
//         const decrypted = await decryptPayload(encryptedResponseData);
//          // Ensure we always set an array
//         if (Array.isArray(decrypted)) {
//           setMeetings(decrypted);
//         } else if (decrypted?.interviews && Array.isArray(decrypted.interviews)) {
//           setMeetings(decrypted.interviews);
//         } else {
//           setMeetings([]);
//         }
//       } catch (error) {
//         console.error('❌ Error fetching interviews:', error);
//         setMeetings([]);
//       }
//     };

//   if (sessionId && candidateId) {
//       fetchInterviews();
//     }
//   }, [sessionId, candidateId]);

//   const handleMeetingScheduled = (newMeeting) => {
//     setMeetings((prev) => [...prev, newMeeting]);
//     setShowScheduleModal(false);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex items-center justify-between mb-2">
//         <h3 className="text-lg font-semibold">Interview Schedule</h3>
//         <button
//           onClick={() => setShowScheduleModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           aria-label="Schedule new interview"
//         >
//           Schedule New Interview
//         </button>
//       </div>
//       <hr className="border-gray-200 mb-4" />
//       <div className="space-y-4">
//         {meetings.length > 0 ? (
//           meetings.map((meeting) => (
//             <div key={meeting.interviewId} className="border border-gray-200 rounded-lg p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h4 className="font-medium">
//                     {meeting.interviewType}
//                     {meeting.isCancelled && (
//                       <span className="ml-2 text-red-500 text-sm font-normal">(Cancelled)</span>
//                     )}
//                   </h4>
//                   <p className="text-sm text-gray-500">
//                     <IoTimeOutline className="w-4 h-4 inline mr-1" />
//                     {new Date(meeting.interviewDate).toLocaleDateString()} at {meeting.interviewStartTime}
//                   </p>
//                   <p className="text-sm text-blue-600 flex items-center mt-1">
//                     <MdVideoCall className="w-4 h-4 mr-1" />
//                     {meeting.meetingPlatform}
//                   </p>
//                 </div>
//                 <div className="flex space-x-2">
//                   {/* <button
//                     className="text-blue-600 hover:text-blue-700"
//                     aria-label={`Join ${meeting.interviewType} interview`}
//                   >
//                     Join
//                   </button> */}

//                   {!meeting.isCancelled && (
//                     <RescheduleInterview
//                       interview={meeting}
//                       sessionId={sessionId}
//                       setMeetings={setMeetings}
//                     />
//                   )}

//                   <CancelInterview
//                     interviewId={meeting.interviewId}
//                     interviewType={meeting.interviewType}
//                     candidateId={candidateId}
//                     sessionId={sessionId}
//                     setMeetings={setMeetings}
//                     isCancelled={meeting.isCancelled}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No interviews scheduled.</p>
//         )}
//       </div>

//       {showScheduleModal && (
//         <InterviewScheduleModal
//           newMeeting={newMeeting}
//           setNewMeeting={setNewMeeting}
//           setShowScheduleModal={setShowScheduleModal}
//           candidateData={candidateData}
//           onMeetingScheduled={handleMeetingScheduled}
//         />
//       )}
//     </div>
//   );
// };

// export default InterviewList;

// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { IoTimeOutline } from "react-icons/io5";
// import { MdVideoCall } from "react-icons/md";
// import { decryptPayload } from "../../../../services/encryptionAndDecryption";
// import { getInterviewSlots } from "../../../../services/api";
// import InterviewScheduleModal from "./InterviewScheduleModal";
// import CancelInterview from "./CancelInterview";
// import RescheduleInterview from "./ReSchudleInteview";

// const InterviewList = ({ setSelectedTab, candidateData }) => {
//   const [meetings, setMeetings] = useState([]);
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [newMeeting, setNewMeeting] = useState({
//     interviewtype: "",
//     interviewRound: "",
//     interviewDate: "",
//     interviewStartTime: "",
//     interviewEndTime: "",
//     interviewTimeInHR: "",
//     meetingPlatform: "",
//     interviewName: "",
//     interviewEmail: "",
//   });

//   const sessionId = useSelector((state) => state.user.sessionId);
//   const { candidateId } = useParams();

//    // Sorting helper
//   const sortMeetings = (meetingsArray) => {
//     return meetingsArray.sort((a, b) => {
//       // Active vs Cancelled
//       if (a.isCancelled && !b.isCancelled) return 1;
//       if (!a.isCancelled && b.isCancelled) return -1;

//       // Both active
//       if (!a.isCancelled && !b.isCancelled) {
//         return new Date(b.createdAt) - new Date(a.createdAt); // newest first
//       }

//       // Both cancelled
//       if (a.isCancelled && b.isCancelled) {
//         return new Date(b.cancelledAt) - new Date(a.cancelledAt); // newest cancelled first
//       }

//       return 0;
//     });
//   };

//   // Fetch interviews data
//   useEffect(() => {
//     const fetchInterviews = async () => {
//       if (!sessionId || !candidateId) return;

//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await getInterviewSlots(sessionId, candidateId);
//         const encryptedResponseData = response?.data?.encryptedResponseData;
//         const decrypted = await decryptPayload(encryptedResponseData);

//         // Ensure we always set an array
//       let meetingsArray = [];
//         if (Array.isArray(decrypted)) {
//           meetingsArray = decrypted;
//         } else if (decrypted?.interviews && Array.isArray(decrypted.interviews)) {
//           meetingsArray = decrypted.interviews;
//         }

//         setMeetings(sortMeetings(meetingsArray));
//       } catch (error) {
//         console.error("❌ Error fetching interviews:", error);
//         setError("Failed to load interviews. Please try again.");
//         setMeetings([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInterviews();
//   }, [sessionId, candidateId]);

//    const handleMeetingScheduled = (newMeeting) => {
//     setMeetings((prev) => sortMeetings([...prev, newMeeting]));
//     setShowScheduleModal(false);
//   };

// const handleRescheduleOpen = (interview) => {
//     console.log("Reschedule modal opened for:", interview.interviewType);
//     // Add any additional logic here if needed
//   };

//   const handleJoinMeeting = (meetingLink) => {
//     // Open the meeting link in a new tab or handle platform-specific logic
//     if (meetingLink) {
//       window.open(meetingLink, "_blank", "noopener,noreferrer");
//     } else {
//       alert("Meeting link not available.");
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-semibold text-gray-800">
//           Interview Schedule
//         </h3>
//         <button
//           onClick={() => setShowScheduleModal(true)}
//           className={`
//             flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white
//             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//             disabled:opacity-50 disabled:cursor-not-allowed
//             transition-colors duration-200
//           `}
//           aria-label="Schedule new interview"
//           disabled={isLoading}
//         >
//           Schedule New Interview
//         </button>
//       </div>
//       <hr className="border-gray-200 mb-6" />

//       {/* Loading State */}
//       {isLoading && (
//         <div className="flex justify-center items-center py-4">
//           <svg
//             className="animate-spin h-6 w-6 text-blue-600"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             />
//           </svg>
//           <span className="ml-2 text-gray-600">Loading interviews...</span>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
//           {error}
//         </div>
//       )}

//       {/* Meetings List */}
//       {!isLoading && !error && (
//         <div className="space-y-4">
//           {meetings.length > 0 ? (
//             meetings.map((meeting) => (
//               <div
//                 key={meeting.interviewId}
//                 className={`
//                   border border-gray-200 rounded-lg p-4 sm:p-6
//                   bg-gray-50 hover:bg-gray-100
//                   transition-colors duration-200
//                 `}
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between">
//                   <div className="mb-4 sm:mb-0">
//                     <h4 className="text-lg font-medium text-gray-800">
//                       {meeting.interviewType}
//                       {meeting.isCancelled && (
//                         <span
//                           className="
//     ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full
//     bg-red-100 text-red-800 text-xs font-medium
//     tracking-wide uppercase
//   "
//                           role="status"
//                           aria-label="Interview cancelled"
//                         >
//                           Cancelled
//                         </span>
//                       )}
//                     </h4>
//                     <p className="text-sm text-gray-500 flex items-center mt-1">
//                       <IoTimeOutline className="w-4 h-4 mr-1" />
//                       {new Date(meeting.createdAt).toLocaleDateString("en-US", {
//                         weekday: "short",
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric",
//                       })}{" "}
//                       at {meeting.interviewStartTime}
//                     </p>
//                     <p className="text-sm text-blue-600 flex items-center mt-1">
//                       <MdVideoCall className="w-4 h-4 mr-1" />
//                       {meeting.meetingPlatform}
//                     </p>
//                   </div>
//                   <div className="flex space-x-2">
//                     {!meeting.isCancelled && (
//                       <button
//                         onClick={() => handleJoinMeeting(meeting.meetingLink)}
//                         className={`
//                           px-3 py-1.5 rounded-md bg-blue-100 text-blue-700
//                           hover:bg-blue-200 hover:text-blue-800
//                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//                           transition-colors duration-200
//                         `}
//                         aria-label={`Join ${meeting.interviewType} interview`}
//                       >
//                         Join
//                       </button>
//                     )}
//                     {/* {!meeting.isCancelled && (
//                       <RescheduleInterview
//                         interview={meeting}
//                         sessionId={sessionId}
//                         setMeetings={setMeetings}
//                       />
//                     )} */}
//                     {
//                       {meetings.map((meeting) => (
//                !meeting.isCancelled && (
//                 <RescheduleInterview
//             key={meeting.id}
//             interview={meeting}
//             sessionId={sessionId}
//             setMeetings={setMeetings}
//             onRescheduleOpen={handleRescheduleOpen}
//           />
//                     }
//                     <CancelInterview
//                       interviewId={meeting.interviewId}
//                       interviewType={meeting.interviewType}
//                       candidateId={candidateId}
//                       sessionId={sessionId}
//                       setMeetings={setMeetings}
//                       isCancelled={meeting.isCancelled}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center py-4">
//               No interviews scheduled yet.
//             </p>
//           )}
//         </div>
//       )}

//       {/* Schedule Modal */}
//       {showScheduleModal && (
//         <InterviewScheduleModal
//           newMeeting={newMeeting}
//           setNewMeeting={setNewMeeting}
//           setShowScheduleModal={setShowScheduleModal}
//           candidateData={candidateData}
//           onMeetingScheduled={handleMeetingScheduled}
//         />
//       )}
//     </div>
//   );
// };

// export default InterviewList;

// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { IoTimeOutline } from "react-icons/io5";
// import { MdVideoCall } from "react-icons/md";
// import { decryptPayload } from "../../../../services/encryptionAndDecryption";
// import { getInterviewSlots } from "../../../../services/api";
// import InterviewScheduleModal from "./InterviewScheduleModal";
// import CancelInterview from "./CancelInterview";
// import RescheduleInterview from "./ReSchudleInteview";

// const InterviewList = ({ setSelectedTab, candidateData }) => {
//   const [meetings, setMeetings] = useState([]);
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [newMeeting, setNewMeeting] = useState({
//     interviewtype: "",
//     interviewRound: "",
//     interviewDate: "",
//     interviewStartTime: "",
//     interviewEndTime: "",
//     interviewTimeInHR: "",
//     meetingPlatform: "",
//     interviewName: "",
//     interviewEmail: "",
//   });

//   const sessionId = useSelector((state) => state.user.sessionId);
//   const { candidateId } = useParams();

//   // Sorting helper
//   const sortMeetings = (meetingsArray) => {
//     return meetingsArray.sort((a, b) => {
//       // Active vs Cancelled
//       if (a.isCancelled && !b.isCancelled) return 1;
//       if (!a.isCancelled && b.isCancelled) return -1;

//       // Both active
//       if (!a.isCancelled && !b.isCancelled) {
//         return new Date(b.createdAt) - new Date(a.createdAt); // newest first
//       }

//       // Both cancelled
//       if (a.isCancelled && b.isCancelled) {
//         return new Date(b.cancelledAt) - new Date(a.cancelledAt); // newest cancelled first
//       }

//       return 0;
//     });
//   };

//   // Fetch interviews data
//   useEffect(() => {
//     const fetchInterviews = async () => {
//       if (!sessionId || !candidateId) return;

//       setIsLoading(true);
//       setError(null);
//       try {
//         const response = await getInterviewSlots(sessionId, candidateId);
//         const encryptedResponseData = response?.data?.encryptedResponseData;
//         const decrypted = await decryptPayload(encryptedResponseData);

//         // Ensure we always set an array
//         let meetingsArray = [];
//         if (Array.isArray(decrypted)) {
//           meetingsArray = decrypted;
//         } else if (
//           decrypted?.interviews &&
//           Array.isArray(decrypted.interviews)
//         ) {
//           meetingsArray = decrypted.interviews;
//         }

//         setMeetings(sortMeetings(meetingsArray));
//       } catch (error) {
//         console.error("❌ Error fetching interviews:", error);
//         setError("Failed to load interviews. Please try again.");
//         setMeetings([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInterviews();
//   }, [sessionId, candidateId]);

//   const handleMeetingScheduled = (newMeeting) => {
//     setMeetings((prev) => sortMeetings([...prev, newMeeting]));
//     setShowScheduleModal(false);
//   };

//   const handleRescheduleOpen = (interview) => {
//     console.log("Reschedule modal opened for:", interview.interviewType);
//     // Add any additional logic here if needed
//   };

//   const handleJoinMeeting = (meetingLink) => {
//     // Open the meeting link in a new tab or handle platform-specific logic
//     if (meetingLink) {
//       window.open(meetingLink, "_blank", "noopener,noreferrer");
//     } else {
//       alert("Meeting link not available.");
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-semibold text-gray-800">
//           Interview Schedule
//         </h3>
//         <button
//           onClick={() => setShowScheduleModal(true)}
//           className={`
//             flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white
//             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//             disabled:opacity-50 disabled:cursor-not-allowed
//             transition-colors duration-200
//           `}
//           aria-label="Schedule new interview"
//           disabled={isLoading}
//         >
//           Schedule New Interview
//         </button>
//       </div>
//       <hr className="border-gray-200 mb-6" />

//       {/* Loading State */}
//       {isLoading && (
//         <div className="flex justify-center items-center py-4">
//           <svg
//             className="animate-spin h-6 w-6 text-blue-600"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             />
//           </svg>
//           <span className="ml-2 text-gray-600">Loading interviews...</span>
//         </div>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
//           {error}
//         </div>
//       )}

//       {/* Meetings List */}
//       {!isLoading && !error && (
//         <div className="space-y-4">
//           {meetings.length > 0 ? (
//             meetings.map((meeting) => (
//               <div
//                 key={meeting.interviewId}
//                 className={`
//                   border border-gray-200 rounded-lg p-4 sm:p-6
//                   bg-gray-50 hover:bg-gray-100
//                   transition-colors duration-200
//                 `}
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center justify-between">
//                   <div className="mb-4 sm:mb-0">
//                     <h4 className="text-lg font-medium text-gray-800">
//                       {meeting.interviewType}
//                       {meeting.isCancelled && (
//                         <span
//                           className="
//                             ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full
//                             bg-red-100 text-red-800 text-xs font-medium
//                             tracking-wide uppercase
//                           "
//                           role="status"
//                           aria-label="Interview cancelled"
//                         >
//                           Cancelled
//                         </span>
//                       )}
//                     </h4>
//                     <p className="text-sm text-gray-500 flex items-center mt-1">
//                       <IoTimeOutline className="w-4 h-4 mr-1" />
//                       {meeting.interviewDate
//                         ? new Date(meeting.interviewDate).toLocaleDateString(
//                             "en-US",
//                             {
//                               month: "long",
//                               day: "numeric",
//                               year: "numeric",
//                             }
//                           )
//                         : "Date not available"}{" "}
//                       at {meeting.interviewStartTime}
//                     </p>
//                     <p className="text-sm text-blue-600 flex items-center mt-1">
//                       <MdVideoCall className="w-4 h-4 mr-1" />
//                       {meeting.meetingPlatform}
//                     </p>
//                   </div>
//                   <div className="flex space-x-2">
//                     {!meeting.isCancelled && (
//                       <button
//                         onClick={() => handleJoinMeeting(meeting.meetingLink)}
//                         className={`
//                           px-3 py-1.5 rounded-md bg-blue-100 text-blue-700
//                           hover:bg-blue-200 hover:text-blue-800
//                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//                           transition-colors duration-200
//                         `}
//                         aria-label={`Join ${meeting.interviewType} interview`}
//                       >
//                         Join
//                       </button>
//                     )}
//                     {!meeting.isCancelled && (
//                       <RescheduleInterview
//                         interview={meeting}
//                         sessionId={sessionId}
//                         setMeetings={setMeetings}
//                         onRescheduleOpen={handleRescheduleOpen}
//                       />
//                     )}
//                     <CancelInterview
//                       interviewId={meeting.interviewId}
//                       interviewType={meeting.interviewType}
//                       candidateId={candidateId}
//                       sessionId={sessionId}
//                       setMeetings={setMeetings}
//                       isCancelled={meeting.isCancelled}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500 text-center py-4">
//               No interviews scheduled yet.
//             </p>
//           )}
//         </div>
//       )}

//       {/* Schedule Modal */}
//       {showScheduleModal && (
//         <InterviewScheduleModal
//           newMeeting={newMeeting}
//           setNewMeeting={setNewMeeting}
//           setShowScheduleModal={setShowScheduleModal}
//           candidateData={candidateData}
//           onMeetingScheduled={handleMeetingScheduled}
//         />
//       )}
//     </div>
//   );
// };

// export default InterviewList;

import React, { useState, useEffect } from "react";
import { CiCalendar, CiLock, CiMail, CiUser } from "react-icons/ci";
import {FiAlertTriangle, FiCheckCircle, FiExternalLink, FiPlus, FiRefreshCw, FiRotateCcw, FiUsers, FiVideo, FiX, FiXCircle } from "react-icons/fi";
import { RiLoader2Fill } from "react-icons/ri";
import { getInterviewSlots } from "../../../../services/api";
import { decryptPayload } from "../../../../services/encryptionAndDecryption";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InterviewScheduleModal from "./InterviewScheduleModal";
import CancelInterview from './CancelInterview';
import RescheduleInterview from './ReSchudleInteview';

const InterviewList = ({ setSelectedTab, candidateData }) => {
  const [meetings, setMeetings] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMeeting, setNewMeeting] = useState({interviewtype: "",interviewRound: "",interviewDate: "",interviewStartTime: "",interviewEndTime: "", interviewTimeInHR: "", meetingPlatform: "",interviewName: "",interviewEmail: "",});
  const sessionId = useSelector((state) => state.user.sessionId);
  const { candidateId } = useParams();
 
  // Sorting helper
  const sortMeetings = (meetingsArray) => {
    return meetingsArray.sort((a, b) => {
      // Active vs Cancelled
      if (a.isCancelled && !b.isCancelled) return 1;
      if (!a.isCancelled && b.isCancelled) return -1;

      // Both active - sort by date
      // if (!a.isCancelled && !b.isCancelled) {
      //   return new Date(a.interviewDate + 'T' + a.interviewStartTime) - new Date(b.interviewDate + 'T' + b.interviewStartTime);
      // }
      if (!a.isCancelled && !b.isCancelled) {
        return new Date(b.createdAt) - new Date(a.createdAt); // newest first
      }

      // Both cancelled
      if (a.isCancelled && b.isCancelled) {
        return new Date(b.cancelledAt) - new Date(a.cancelledAt); // newest cancelled first
      }
      // // Both cancelled
      // if (a.isCancelled && b.isCancelled) {
      //   return new Date(b.cancelledAt) - new Date(a.cancelledAt);
      // }

      return 0;
    });
  };
    // Fetch interviews data
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!sessionId || !candidateId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await getInterviewSlots(sessionId, candidateId);
        const encryptedResponseData = response?.data?.encryptedResponseData;
        const decrypted = await decryptPayload(encryptedResponseData);

        // Ensure we always set an array
        let meetingsArray = [];
        if (Array.isArray(decrypted)) {
          meetingsArray = decrypted;
        } else if (
          decrypted?.interviews &&
          Array.isArray(decrypted.interviews)
        ) {
          meetingsArray = decrypted.interviews;
        }

        setMeetings(sortMeetings(meetingsArray));
      } catch (error) {
        console.error("❌ Error fetching interviews:", error);
        setError("Failed to load interviews. Please try again.");
        setMeetings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [sessionId, candidateId]);

   const handleMeetingScheduled = (newMeeting) => {
    setMeetings((prev) => sortMeetings([...prev, newMeeting]));
    setShowScheduleModal(false);
  };

  const handleRescheduleOpen = (interview) => {
    console.log("Reschedule modal opened for:", interview.interviewType);
  };

  const handleJoinMeeting = (meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, "_blank", "noopener,noreferrer");
    } else {
      alert("Meeting link not available.");
    }
  };

  const getStatusIcon = (meeting) => {
    if (meeting.isCancelled) return <FiXCircle className="w-4 h-4 text-red-500" />;
    if (meeting.status === "Completed") return <FiCheckCircle className="w-4 h-4 text-green-500" />;
    if (meeting.status === "Rescheduled") return <FiRefreshCw className="w-4 h-4 text-orange-500" />;
    return <Calendar className="w-4 h-4 text-blue-500" />;
  };

  const getStatusBadge = (meeting) => {
    if (meeting.isCancelled) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
          <FiCheckCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    }
    if (meeting.status === "Completed") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
          <FiCheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (meeting.status === "Rescheduled") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
          <FiRefreshCw className="w-3 h-3" />
          Rescheduled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
        <CiCalendar className="w-3 h-3" />
        Scheduled
      </span>
    );
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {case 'zoom': return '🔵';case 'google meet': return '🟢';case 'microsoft teams': return '🟣';case 'in-person': return '🏢';
      default: return '📹';
    }
  };

  const getInterviewTypeIcon = (type) => {
    switch (type?.toLowerCase()) {case 'phone screening': return '📞';case 'technical interview': return '💻';case 'behavioral interview': return '🤝';case 'final interview': return '🎯';
      default: return '📋';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
            Interview Schedule
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all candidate interviews</p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          aria-label="Schedule new interview"
          disabled={isLoading}
        >
          <FiPlus className="w-5 h-5" />
          Schedule New Interview
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <CiCalendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-green-600">{meetings.filter(m => !m.isCancelled).length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{meetings.filter(m => m.isCancelled).length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <FiCheckCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-600">2</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <CiLock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <RiLoader2Fill className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Loading interviews...</p>
          <p className="text-gray-500 text-sm">Please wait while we fetch your data</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Interviews</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Meetings List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <div
                key={meeting.interviewId}
                className={`
                  bg-white border rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-200
                  ${meeting.isCancelled ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-blue-300'}
                `}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Interview Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getInterviewTypeIcon(meeting.interviewType)}</span>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {meeting.interviewType}
                      </h3>
                      {getStatusBadge(meeting)}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CiCalendar className="w-4 h-4" />
                        <span className="font-medium">
                          {meeting.interviewDate
                            ? new Date(meeting.interviewDate).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Date not available"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <CiLock className="w-4 h-4" />
                        <span className="font-medium">
                          {meeting.interviewStartTime} - {meeting.interviewEndTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiVideo className="w-4 h-4" />
                        <span className="font-medium">
                          {getPlatformIcon(meeting.meetingPlatform)} {meeting.meetingPlatform}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <CiUser className="w-4 h-4" />
                        <span className="font-medium">
                          {meeting.interviewName || "TBD"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                    {!meeting.isCancelled && (
                      <button
                        onClick={() => handleJoinMeeting(meeting.meetingLink)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        aria-label={`Join ${meeting.interviewType} interview`}
                      >
                        <FiExternalLink className="w-4 h-4" />
                        Join Meeting
                      </button>
                    )}
                    
                    <div className="flex gap-2">
                      {!meeting.isCancelled && (
                        <RescheduleInterview
                          interview={meeting}
                          sessionId={sessionId}
                          setMeetings={setMeetings}
                          onRescheduleOpen={handleRescheduleOpen}
                        />
                      )}
                      <CancelInterview
                        interviewId={meeting.interviewId}
                        interviewType={meeting.interviewType}
                        candidateId={candidateId}
                        sessionId={sessionId}
                        setMeetings={setMeetings}
                        isCancelled={meeting.isCancelled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-2xl inline-block mb-4">
                <CiCalendar className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interviews Scheduled</h3>
              <p className="text-gray-600 mb-6">Get started by scheduling your first interview with this candidate.</p>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FiPlus className="w-5 h-5" />
                Schedule First Interview
              </button>
            </div>
          )}
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <InterviewScheduleModal
          newMeeting={newMeeting}
          setNewMeeting={setNewMeeting}
          setShowScheduleModal={setShowScheduleModal}
          candidateData={candidateData}
          onMeetingScheduled={handleMeetingScheduled}
        />
      )}
    </div>
  );
};

export default InterviewList;

import React, { useState } from "react";
import {
  CiCalendar,
  CiLink,
  CiLocationOn,
  CiMail,
  CiPhone,
  CiUser,
} from "react-icons/ci";
import UpdateCandidateStatus from "./UpdateCandiateStatus";
import { FaBriefcase, FaClock, FaMoneyBillWave } from "react-icons/fa";
import InterviewScheduleModal from "./InterView/InterviewScheduleModal";

const CandidateOverview = ({ candidateData, onStatusUpdated }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    interviewtype: "",
    interviewRound: "",
    interviewDate: "",
    interviewStartTime: "",
    interviewEndTime: "",
    interviewTimeInHR: "",
    meetingPlatform: "",
    interviewName: "",
    interviewEmail: "",
  });

  const handleMeetingScheduled = (meeting) => {
    console.log("Meeting scheduled:", meeting);
    setShowScheduleModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ">
      {/* Candidate Header Card - Sticky */}
      <div className="bg-gradient-to-r  from-white via-blue-50 to-purple-50 shadow-lg rounded-2xl border-b border-gray-200  sticky top-0 z-40 ">
        {/* gap-4 px-5 py-3 p-5   */}
        <div className="flex items-center justify-between flex-wrap gap-4  ">
          <div className="flex items-center space-x-2 p-3">
            {/* Avatar */}
            <div className="relative ml-1">
              <img
                src={
                  candidateData?.candidateImage
                    ? `data:image/jpeg;base64,${candidateData.candidateImage}`
                    : "/default-avatar.png"
                }
                alt={candidateData?.name || "Candidate"}
                className="w-50 h-50 rounded-2xl shadow-xl ring-4 ring-white object-cover"
              />
            </div>
            <div className="mb-27">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {candidateData?.name || "Unknown Candidate"}
              </h1>
              <p className="text-gray-600 text-lg">
                {candidateData?.jobTitle || "Position Not Specified"}
              </p>
            </div>
          </div>
          {/* Schedule Interview + Status */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="absolute top-5 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              <CiCalendar className="w-5 h-5" />
              <span>Schedule Interview</span>
            </button>
          </div>
          {/* Status Dropdown */}
          <div className="absolute bottom-4 right-0 flex justify-end items-center gap-3 ">
            <label className="text-sm font-medium mb-1  bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-4 py-2">
              Update Candidate Progress Status
            </label>
            <UpdateCandidateStatus
              candidateData={candidateData}
              onStatusUpdated={onStatusUpdated}
            />
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <InterviewScheduleModal
          newMeeting={newMeeting}
          setNewMeeting={setNewMeeting}
          setShowScheduleModal={setShowScheduleModal}
          candidateData={candidateData}
          onMeetingScheduled={handleMeetingScheduled}
        />
      )}

      {/* Candidate Information Card */}
      <div className="p-3">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CiUser className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Candidate Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <CiUser className="w-4 h-4" />
                <span>Full Name</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.name || "Not specified"}
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <CiMail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.email || "Not specified"}
              </p>
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <CiPhone className="w-4 h-4" />
                <span>Mobile Number</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.mobileNo || "Not specified"}
              </p>
            </div>

            {/* Current Location */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <CiLocationOn className="w-4 h-4" />
                <span>Current Location</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.currentLocation || "Not specified"}
              </p>
            </div>

            {/* Job Title */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <FaBriefcase className="w-4 h-4" />
                <span>Job Title</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.jobTitle || "Not specified"}
              </p>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <FaBriefcase className="w-4 h-4" />
                <span>Experience</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.experience || "Not specified"}
              </p>
            </div>

            {/* Expected Salary */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <FaMoneyBillWave className="w-4 h-4" />
                <span>Expected Salary</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.expectedSalary || "Not specified"}
              </p>
            </div>

            {/* Notice Period */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <FaClock className="w-4 h-4" />
                <span>Notice Period</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.availabilityNoticePeriod || "Not specified"}
              </p>
            </div>

            {/* LinkedIn Profile */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <CiLink className="w-4 h-4" />
                <span>LinkedIn Profile</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium break-all">
                {candidateData?.linkedInProfile ? (
                  <a
                    href={candidateData.linkedInProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {candidateData.linkedInProfile}
                  </a>
                ) : (
                  "Not specified"
                )}
              </p>
            </div>

            {/* Resume */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <CiLink className="w-4 h-4" />
                <span>Resume</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.resume ? (
                  <a
                    href={candidateData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Resume
                  </a>
                ) : (
                  "Not specified"
                )}
              </p>
            </div>

            {/* Applied Date */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <CiCalendar className="w-4 h-4" />
                <span>Applied Date</span>
              </label>
              <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl font-medium">
                {candidateData?.appliedDate
                  ? new Date(candidateData.appliedDate).toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateOverview;

// import React, { useState } from "react";
// import { CiCalendar, CiLock, CiMail, CiMapPin, CiPhone, CiStar, CiUser } from "react-icons/ci";
// import { FaBuilding, FaGraduationCap } from "react-icons/fa";
// import { FiAward, FiBriefcase, FiDollarSign, FiFileText } from "react-icons/fi";
// import { RiInfoCardFill } from "react-icons/ri";
// import InterviewScheduleModal from "./InterView/InterviewScheduleModal";
// import { Link } from "react-router-dom";
// import UpdateCandidateStatus from "./UpdateCandiateStatus";
// import { RiInfoCardLine } from "react-icons/ri";

// const CandidateOverview = ({ candidateData, onStatusUpdated }) => {
//   const [showScheduleModal, setShowScheduleModal] = useState(false);
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

//   const handleMeetingScheduled = (meeting) => {
//     console.log("Meeting scheduled:", meeting);
//     setShowScheduleModal(false);
//   };

//   const getInitials = (name) => {
//     return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C';
//   };

//   const InfoCard = ({ icon: Icon, label, value, href, isLink = false }) => (
//     <div className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
//       <div className="flex items-start gap-3">
//         <div className="p-2 bg-blue-50 rounded-lg">
//           <Icon className="w-4 h-4 text-blue-600" />
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
//             {label}
//           </p>
//           {isLink && value ? (
//             <a
//               href={href || value}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline break-words"
//             >
//               {value === candidateData.resume ? "View Resume" : value}
//             </a>
//           ) : (
//             <p className="text-gray-900 font-medium text-sm break-words">
//               {value || "Not specified"}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
//       {/* Hero Header */}
//       <div className="bg-white shadow-lg border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//             {/* Candidate Profile */}
//             <div className="flex items-center gap-6">
//               {/* Avatar */}
//               {/* <div className="relative">
//                 <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-4 ring-blue-100">
//                   {getInitials(candidate.name)}
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 bg-green-500 w-7 h-7 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
//                   <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//                 </div>
//               </div> */}

//               {/* Basic Info */}
//               <div className="space-y-1">
//                 <h1 className="text-3xl font-bold text-gray-900">
//                   {candidateData.name}
//                 </h1>
//                 <p className="text-lg text-gray-600 font-medium">
//                   {candidateData.jobTitle}
//                 </p>
//                 <div className="flex items-center gap-4 text-sm text-gray-500">
//                   <span className="flex items-center gap-1">
//                     <CiMapPin className="w-4 h-4" />
//                     {candidateData.currentLocation}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <CiLock className="w-4 h-4" />
//                     {candidateData.experience}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <FiDollarSign className="w-4 h-4" />
//                     {candidateData.expectedSalary}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-4">
//               <UpdateCandidateStatus
//                 candidateData={candidateData}
//                 onStatusUpdated={onStatusUpdated}
//               />
//               <button
//                 onClick={() => setShowScheduleModal(true)}
//                 className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 font-semibold"
//               >
//                 <CiCalendar className="w-5 h-5" />
//                 Schedule Interview
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Info Panel */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-blue-100 rounded-xl">
//                   <CiUser className="w-6 h-6 text-blue-600" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Contact Information
//                 </h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <RiInfoCardLine icon={CiUser} label="Full Name" value={candidateData.name} />
//                 <RiInfoCardLine icon={CiMail} label="Email Address" value={candidateData.email} />
//                 <RiInfoCardLine icon={CiPhone} label="Mobile Number" value={candidateData.mobileNo} />
//                 <RiInfoCardLine icon={CiMapPin} label="Current Location" value={candidateData.currentLocation} />
//                 <RiInfoCardLine
//                   icon={Link}
//                   label="LinkedIn Profile"
//                   value={candidateData.linkedInProfile}
//                   isLink={true}
//                 />
//                 <RiInfoCardLine
//                   icon={FiFileText}
//                   label="Resume"
//                   value={candidateData.resume ? "View Resume" : "Not specified"}
//                   href={candidateData.resume}
//                   isLink={true}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Side Panel */}
//           <div className="space-y-6">
//             {/* Professional Details */}
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-green-100 rounded-xl">
//                   <FiBriefcase className="w-6 h-6 text-green-600" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">
//                   Professional Details
//                 </h2>
//               </div>

//               <div className="space-y-4">
//                 <RiInfoCardLine  icon={FiBriefcase} label="Job Title" value={candidateData.jobTitle} />
//                 <RiInfoCardLine icon={FiAward} label="Experience" value={candidateData.experience} />
//                 <RiInfoCardLine icon={FiDollarSign} label="Expected Salary" value={candidateData.expectedSalary} />
//                 <RiInfoCardLine icon={CiLock} label="Notice Period" value={candidateData.availabilityNoticePeriod} />
//                 <RiInfoCardLine
//                   icon={CiCalendar}
//                   label="Applied Date"
//                   value={candidateData.appliedDate ? new Date(candidateData.appliedDate).toLocaleDateString() : "Not specified"}
//                 />
//               </div>
//             </div>

//             {/* Status Card */}
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-blue-100 rounded-xl">
//                   <FaBuilding className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <h3 className="text-lg font-bold text-gray-900">
//                   Application Status
//                 </h3>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span className="text-blue-700 font-semibold">
//                   {candidateData.status || "Active"}
//                 </span>
//               </div>
//             </div>

//             {/* Education (if available) */}
//             {candidateData.education && (
//               <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-2 bg-purple-100 rounded-xl">
//                     <FaGraduationCap className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <h2 className="text-xl font-bold text-gray-900">
//                     Education
//                   </h2>
//                 </div>
//                 <p className="text-gray-700 font-medium">
//                   {candidateData.education}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
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

// export default CandidateOverview;

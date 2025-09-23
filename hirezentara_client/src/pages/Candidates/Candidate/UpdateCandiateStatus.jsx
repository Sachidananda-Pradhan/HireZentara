import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateCandidateStatus } from "../../../services/api";

const statusOptions = [
  "APPLIED",
  "IN_REVIEW",
  "SHORTLISTED",
  "PHONE_SCREENING",
  "TECHNICAL_INTERVIEW",
  "FINAL_INTERVIEW",
  "OFFERED",
  "HIRED",
  "REJECTED",
];

const getStatusColor = (status) => {
  const colors = {
    APPLIED: "bg-blue-100 text-blue-800 border-blue-200",
    IN_REVIEW: "bg-yellow-100 text-yellow-800 border-yellow-200",
    SHORTLISTED: "bg-pink-100 text-pink-800 border-pink-200",
    PHONE_SCREENING: "bg-purple-100 text-purple-800 border-purple-200",
    TECHNICAL_INTERVIEW: "bg-orange-100 text-orange-800 border-orange-200",
    FINAL_INTERVIEW: "bg-indigo-100 text-indigo-800 border-indigo-200",
    OFFERED: "bg-green-100 text-green-800 border-green-200",
    HIRED: "bg-green-200 text-green-900 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

const UpdateCandidateStatus = ({ candidateData, onStatusUpdated }) => {
  const sessionId = useSelector((state) => state.user.sessionId);
  const { candidateId } = useParams();

  const [candidateStatus, setCandidateStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Sync candidateStatus with candidateData.candidateStatus when it changes
  useEffect(() => {
    setCandidateStatus(candidateData?.candidateStatus || "");
  }, [candidateData?.candidateStatus]);

  const handleStatusUpdate = async (newStatus) => {
    if (!newStatus || newStatus === candidateStatus) return;

    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      // Call API to update status
      await updateCandidateStatus(sessionId, candidateId, newStatus);

      // Update local state
      setCandidateStatus(newStatus);

      // Notify parent component
      if (onStatusUpdated) {
        onStatusUpdated(newStatus);
      }

      setSuccessMessage("Candidate status updated successfully!");
    } catch (err) {
      console.error("Error updating candidate status:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update candidate status. Please try again."
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="p-6">
      {isLoading && <p className="text-gray-600">Updating status...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {candidateData?.name || "Unknown Candidate"}
      </h1>
      <p className="text-gray-600 text-lg mb-3">
        {candidateData?.jobTitle || "Position Not Specified"}
      </p>

      <div className="flex items-center space-x-4">
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${getStatusColor(
            candidateStatus
          )} shadow-md`}
        >
          {candidateStatus || "Unknown Status"}
        </span>

        <select
          value={candidateStatus}
          onChange={(e) => handleStatusUpdate(e.target.value)}
          className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
          disabled={isLoading}
        >
          <option value="" disabled>
            Select Status
          </option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
    </div>
  );
};

export default UpdateCandidateStatus;

// const UpdateCandidateStatus = ({ candidateData, onStatusUpdated }) => {
//   const sessionId = useSelector((state) => state.user.sessionId);
//   const { candidateId } = useParams();

//   const [candidateStatus, setCandidateStatus] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   // Sync candidateStatus with candidateData.candidateStatus
//   useEffect(() => {
//     setCandidateStatus(candidateData?.candidateStatus || "");
//   }, [candidateData?.candidateStatus]);

//   // Filter status options to show only subsequent statuses
//   const getAvailableStatusOptions = () => {
//     if (!candidateStatus) {
//       return statusOptions; // Show all options if no status is set
//     }
//     const currentIndex = statusOptions.indexOf(candidateStatus);
//     if (currentIndex === -1) {
//       return statusOptions; // Show all if current status is invalid
//     }
//     // Include statuses after the current one, plus REJECTED (terminal state)
//     const subsequentStatuses = statusOptions.slice(currentIndex + 0);
//     return [...subsequentStatuses, "REJECTED"].filter(
//       (status, index, self) => self.indexOf(status) === index // Remove duplicates
//     );
//   };

//   const handleStatusUpdate = async (newStatus) => {
//     if (!newStatus || newStatus === candidateStatus) return;

//     try {
//       setIsLoading(true);
//       setError("");
//       setSuccessMessage("");

//       // Call API to update status
//       await updateCandidateStatus(sessionId, candidateId, newStatus);

//       // Update local state
//       setCandidateStatus(newStatus);

//       // Notify parent component
//       if (onStatusUpdated) {
//         onStatusUpdated(newStatus);
//       }

//       setSuccessMessage("Candidate status updated successfully!");
//     } catch (err) {
//       console.error("Error updating candidate status:", err);
//       setError(
//         err.response?.data?.message ||
//         "Failed to update candidate status. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//       setTimeout(() => setSuccessMessage(""), 3000);
//     }
//   };

//   const availableStatusOptions = getAvailableStatusOptions();

//   return (
//     <div className="p-6">
//       {isLoading && <p className="text-gray-600">Updating status...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <h1 className="text-3xl font-bold text-gray-900 mb-2">
//         {candidateData?.name || "Unknown Candidate"}
//       </h1>
//       <p className="text-gray-600 text-lg mb-3">
//         {candidateData?.jobTitle || "Position Not Specified"}
//       </p>

//       <div className="flex items-center space-x-4">
//         <span
//           className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${getStatusColor(candidateStatus)} shadow-md`}
//         >
//           {candidateStatus || "Unknown Status"}
//         </span>

//         <select
//           value={candidateStatus}
//           onChange={(e) => handleStatusUpdate(e.target.value)}
//           className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
//           disabled={isLoading || availableStatusOptions.length === 0}
//         >
//           <option value="" disabled>
//             Select Status
//           </option>
//           {availableStatusOptions.map((status) => (
//             <option key={status} value={status}>
//               {status}
//             </option>
//           ))}
//         </select>
//       </div>

//       {successMessage && (
//         <p className="text-green-600 mt-2">{successMessage}</p>
//       )}
//     </div>
//   );
// };

// export default UpdateCandidateStatus;

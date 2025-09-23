// import React from 'react';
// import { cancelInterview } from '../../../../services/api';


// const CancelInterview = ({ interviewId, interviewType,candidateId, sessionId, setMeetings,isCancelled }) => {

     
//   const handleCancel = async () => {
//     if (!confirm('Are you sure you want to cancel this interview?')) return;
//     try {
//       await cancelInterview(sessionId,candidateId,interviewId);
     
//       setMeetings((prev) =>
//         prev.map((m) =>
//           m.interviewId === interviewId ? { ...m, isCancelled: true } : m
//         )
//       );

//       alert('Interview canceled successfully!');
//     } catch (error) {
//       console.error('Error canceling interview:', error);
//       alert('Failed to cancel interview. Please try again.');
//     }
//   };
// // Don't render the button if already cancelled
//   if (isCancelled) return null;

//   return (
//     <button
//       className="cancel-btn text-red-600 hover:text-red-700"
//       onClick={handleCancel}
//       aria-label={`Cancel ${interviewType} interview`}
//     >
//       Cancel
//     </button>
//   );
// };


// export default CancelInterview;

import React, { useState } from 'react';
import { cancelInterview } from '../../../../services/api';

const CancelInterview = ({ interviewId,interviewType,candidateId,sessionId,setMeetings,isCancelled}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    // Use a more modern confirmation dialog if needed (e.g., a modal)
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;

    setIsLoading(true);
    try {
      await cancelInterview(sessionId, candidateId, interviewId);

      // Update the meetings state to mark the interview as cancelled
      setMeetings((prev) =>
        prev.map((m) =>
          m.interviewId === interviewId ? { ...m, isCancelled: true } : m
        )
      );

      // Consider using a toast notification library (e.g., react-toastify) for better UX
      alert('Interview canceled successfully!');
    } catch (error) {
      console.error('Error canceling interview:', error);
      alert('Failed to cancel interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render the button if already cancelled
  if (isCancelled) return null;

  return (
    <button
      type="button"
      className={`
        flex items-center justify-center px-4 py-2 rounded-md
        bg-red-100 text-red-700 font-medium
        hover:bg-red-200 hover:text-red-800
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
      `}
      onClick={handleCancel}
      disabled={isLoading}
      aria-label={`Cancel ${interviewType} interview`}
      aria-disabled={isLoading}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {isLoading ? 'Canceling...' : 'Cancel Interview'}
    </button>
  );
};
export default CancelInterview;

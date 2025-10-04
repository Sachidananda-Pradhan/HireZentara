import React, { useState, useEffect } from "react";
import { CiCalendar, CiLock, CiMail, CiUser } from "react-icons/ci";
import {FiAlertTriangle,FiCheckCircle,FiExternalLink,FiPlus,FiRefreshCw,FiRotateCcw,FiUser,FiUserMinus, FiVideo, FiX,FiXCircle,} from "react-icons/fi";
import { RiLoader2Fill } from "react-icons/ri";
import { getInterviewSlots } from "../../../../services/api";
import { decryptPayload } from "../../../../services/encryptionAndDecryption";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import InterviewScheduleModal from "./InterviewScheduleModal";
import CancelInterview from "./CancelInterview";
import RescheduleInterview from "./ReSchudleInteview";

const InterviewList = ({ setSelectedTab, candidateData }) => {
  const [meetings, setMeetings] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMeeting, setNewMeeting] = useState({interviewtype: "",interviewRound: "",interviewDate: "",interviewStartTime: "",interviewEndTime: "",interviewTimeInHR: "",meetingPlatform: "",interviewName: "", interviewEmail: "",});
  const sessionId = useSelector((state) => state.user.sessionId);
  const { candidateId } = useParams();

  // Sorting helper
  const sortMeetings = (meetingsArray) => {
    return meetingsArray.sort((a, b) => {
      if (a.isCancelled && !b.isCancelled) return 1;
      if (!a.isCancelled && b.isCancelled) return -1;
      if (!a.isCancelled && !b.isCancelled) {
        return new Date(b.createdAt) - new Date(a.createdAt); 
      }

      // Both cancelled
      if (a.isCancelled && b.isCancelled) {
        return new Date(b.cancelledAt) - new Date(a.cancelledAt); 
      }
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
    if (meeting.isCancelled)
      return <FiXCircle className="w-4 h-4 text-red-500" />;
    if (meeting.interviewStatus === "COMPLETED")
      return <FiCheckCircle className="w-4 h-4 text-green-500" />;
    if (meeting.interviewStatus === "RESCHEDULED")
      return <FiRefreshCw className="w-4 h-4 text-orange-500" />;
    return <CiCalendar className="w-4 h-4 text-blue-500" />;
  };

  const getStatusBadge = (meeting) => {
    if (meeting.isCancelled) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
          <FiXCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    }
    if (meeting.interviewStatus === "COMPLETED") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
          <FiCheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (meeting.interviewStatus === "RESCHEDULED") {
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
    switch (platform?.toLowerCase()) {
      case "zoom":
        return "🔵";
      case "google meet":
        return "🟢";
      case "microsoft teams":
        return "🟣";
      case "in-person":
        return "🏢";
      default:
        return "📹";
    }
  };

  const getInterviewTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "phone screening":
        return "📞";
      case "technical interview":
        return "💻";
      case "behavioral interview":
        return "🤝";
      case "final interview":
        return "🎯";
      default:
        return "📋";
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
            Interview Schedule
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all  interviews
          </p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {meetings.length}
              </p>
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
              <p className="text-2xl font-bold text-green-600">
                {
                  meetings.filter(
                    (m) => !m.isCancelled && m.interviewStatus === "SCHEDULED"
                  ).length
                }
              </p>
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
              <p className="text-2xl font-bold text-red-600">
                {meetings.filter((m) => m.isCancelled).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <FiCheckCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rescheduled</p>
              <p className="text-2xl font-bold text-orange-600">
                {
                  meetings.filter((m) => m.interviewStatus === "RESCHEDULED")
                    .length
                }
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <FiRefreshCw className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        {/* <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-600">2</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <CiLock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div> */}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <RiLoader2Fill className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-lg">Loading interviews...</p>
          <p className="text-gray-500 text-sm">
            Please wait while we fetch your data
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">
                Error Loading Interviews
              </h3>
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
                  ${
                    meeting.isCancelled
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 hover:border-blue-300"
                  }
                `}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Interview Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">
                        {getInterviewTypeIcon(meeting.interviewType)}
                      </span>
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
                            ? new Date(
                                meeting.interviewDate
                              ).toLocaleDateString("en-US", {
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
                          {meeting.interviewStartTime} -{" "}
                          {meeting.interviewEndTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600">
                        <FiVideo className="w-4 h-4" />
                        <span className="font-medium">
                          {getPlatformIcon(meeting.meetingPlatform)}{" "}
                          {meeting.meetingPlatform}
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
                       {!meeting.isCancelled && meeting.interviewStatus !== "RESCHEDULED" && (
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Interviews Scheduled
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by scheduling your first interview with this
                candidate.
              </p>
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

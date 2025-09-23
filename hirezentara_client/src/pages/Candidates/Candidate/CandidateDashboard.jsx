import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { FaUser, FaVideo } from 'react-icons/fa';
import { AiTwotoneFileText } from 'react-icons/ai';
import { CiMail } from 'react-icons/ci';
import { RiEdit2Fill } from 'react-icons/ri';
import { getCandidateByJobId } from '../../../services/api';
import { decryptPayload } from '../../../services/encryptionAndDecryption';
import Sidebar from './Sidebar.';
import CandidateOverview from './CandidateOverview';
import ShowResume from './ShowResume';
import InterviewList from './InterView/InterviewList';

const CandidateDashboard = () => {

  const [selectedTab, setSelectedTab] = useState("overview");
  const [candidateStatus, setCandidateStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  // const [meetings, setMeetings] = useState([]);
  // const [newMeeting, setNewMeeting] = useState({
  //   interviewtype: '',
  //   interviewRound: '',
  //   interviewDate: '',
  //   interviewStartTime: '',
  //   interviewEndTime: '',
  //   interviewTimeInHR: '',
  //   meetingPlatform: '',
  //   interviewName: '',
  //   interviewEmail: '',
  // });
  const [showResumeModal, setShowResumeModal] = useState(false); // Moved here
  const [selectedResume, setSelectedResume] = useState(null);
  const sessionId = useSelector((state) => state.user.sessionId);
  const { candidateId } = useParams();
  const [candidateData, setCandidateData] = useState({});

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await getCandidateByJobId(sessionId, candidateId);
        const encryptedResponseData = response?.data?.encryptedResponseData;
        const decrypted = await decryptPayload(encryptedResponseData);

        setCandidateData(decrypted || {});
        if (decrypted?.status) {
          setCandidateStatus(decrypted.status);
        }
        console.log("Fetched candidate:", decrypted);
      } catch (error) {
        console.error("Error fetching candidate:", error);
      }
    };

    if (sessionId && candidateId) {
      fetchCandidate();
    }
  }, [sessionId, candidateId]);

  //  const handleMeetingScheduled = (newMeeting) => {
  //   setMeetings((prev) => [...prev, newMeeting]);
  // };
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: <FaUser /> },
    { id: "resume", label: "Resume & Documents", icon: <AiTwotoneFileText /> },
    { id: "interviews", label: "Interviews", icon: <FaVideo /> },
    { id: "communications", label: "Communications", icon: <CiMail /> },
    { id: "notes", label: "Notes & Feedback", icon: <RiEdit2Fill /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        candidateData={candidateData}
        sidebarItems={sidebarItems}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {selectedTab === "overview" && (
          <>
            {/* Candidate info + edit mode */}
            <CandidateOverview
              candidateData={candidateData}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onStatusUpdated={(newStatus) => {
                    setCandidateStatus(newStatus);
                    setCandidateData((prev) => ({ ...prev, status: newStatus }));
                }}
            />

            {/* Candidate status control
            <UpdateCandidateStatus
              candidateData={candidateData}
              onStatusUpdated={(newStatus) => {
                setCandidateStatus(newStatus);
                setCandidateData((prev) => ({ ...prev, status: newStatus }));
              }}
            /> */}
          </>
        )}
        {selectedTab === 'interviews' && (
          <InterviewList setSelectedTab={setSelectedTab} candidateData={candidateData} />
        )}

            {selectedTab === 'resume' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Resume & Documents</h3>
            <hr className="border-gray-200 mb-4" />
            <div className="space-y-4">
              {candidateData?.resume ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AiTwotoneFileText className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="font-medium">
                        {candidateData.name ? `${candidateData.name} Resume` : 'Candidate Resume'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {candidateData.appliedDate
                          ? `Uploaded on ${new Date(candidateData.appliedDate).toLocaleDateString()}`
                          : 'Upload date not available'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedResume(candidateData.resume);
                      setShowResumeModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    aria-label="View candidate resume"
                  >
                    View Resume
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">No resume or documents available.</p>
              )}
            </div>
          </div>
        )}
            {selectedTab === "communications" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Communications History</h3>
                <p className="text-gray-500">Content for communications will be implemented here.</p>
              </div>
            )}

            {selectedTab === 'notes' && (
           <NotesFeedback setSelectedTab={setSelectedTab} candidateData={candidateData} />
           )}

            

            {/* {selectedTab === "notes" && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Notes & Feedback</h3>
                <p className="text-gray-500">Content for notes will be implemented here.</p>
              </div>
            )} */}
      </div>

      {/* Schedule Modal
      {showScheduleModal && (
        <InterviewScheduleModal
          newMeeting={newMeeting}
          setNewMeeting={setNewMeeting}
          setShowScheduleModal={setShowScheduleModal}
          candidateData={candidateData}
          onMeetingScheduled={handleMeetingScheduled}
        />
      )} */}
      {/* Resume Modal */}
      {showResumeModal && selectedResume && (
        <ShowResume
          isOpen={showResumeModal}
          onClose={() => setShowResumeModal(false)}
          resume={selectedResume}
        />
      )}
    </div>
  );
};

export default CandidateDashboard;
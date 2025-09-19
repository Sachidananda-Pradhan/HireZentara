import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FaBriefcase, FaUser, FaUserLarge, FaUserLargeSlash } from "react-icons/fa6";
import { AiTwotoneFileText } from "react-icons/ai";
import { FaVideo } from "react-icons/fa";
import {  CiLock, CiMail, CiMapPin, CiPhone } from "react-icons/ci";
import { RiEdit2Fill, RiEdit2Line, RiFileTextFill } from "react-icons/ri";
import { IconBase } from 'react-icons/lib';
import { CiCalendar } from "react-icons/ci";
import { getCandidateByJobId } from '../../services/api';
import { decryptPayload } from '../../services/encryptionAndDecryption';


const CandidateDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [candidateStatus, setCandidateStatus] = useState('In Review');
  const [isEditing, setIsEditing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetings, setMeetings] = useState([
    { id: 1, type: 'Phone Screening', date: '2025-09-25', time: '10:00 AM', status: 'Scheduled' },
    { id: 2, type: 'Technical Interview', date: '2025-09-28', time: '2:00 PM', status: 'Pending' }
  ]);
   const sessionId = useSelector((state) => state.user.sessionId);
  const { candidateId } = useParams();
  const [candidateData, setCandidateData] = useState();

   useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await getCandidateByJobId(sessionId, candidateId);
       const encryptedResponseData = response?.data?.encryptedResponseData;
        const decrypted = await decryptPayload(encryptedResponseData);

        setCandidateData(decrypted|| {});
        console.log(decrypted);
        
      } catch (error) {
        console.error("Error fetching candidate:", error);
      }
    };

    fetchCandidate();
  }, [sessionId, candidateId]);


  const [newMeeting, setNewMeeting] = useState({
    type: '',
    date: '',
    time: '',
    interviewer: '',
    notes: ''
  });

  const statusOptions = ['Applied', 'In Review', 'Phone Screen', 'Technical Interview', 'Final Interview', 'Offer Extended', 'Hired', 'Rejected'];
  
  const getStatusColor = (status) => {
    const colors = {
      'Applied': 'bg-blue-100 text-blue-800',
      'In Review': 'bg-yellow-100 text-yellow-800',
      'Phone Screen': 'bg-purple-100 text-purple-800',
      'Technical Interview': 'bg-orange-100 text-orange-800',
      'Final Interview': 'bg-indigo-100 text-indigo-800',
      'Offer Extended': 'bg-green-100 text-green-800',
      'Hired': 'bg-green-200 text-green-900',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleScheduleMeeting = () => {
    if (newMeeting.type && newMeeting.date && newMeeting.time) {
      setMeetings([...meetings, {
        id: meetings.length + 1,
        ...newMeeting,
        status: 'Scheduled'
      }]);
      setNewMeeting({ type: '', date: '', time: '', interviewer: '', notes: '' });
      setShowScheduleModal(false);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <FaUser />  },
    { id: 'resume', label: 'Resume & Documents', icon: <AiTwotoneFileText /> },
    { id: 'interviews', label: 'Interviews', icon: <FaVideo /> },
    { id: 'communications', label: 'Communications', icon: <CiMail /> },
    { id: 'notes', label: 'Notes & Feedback', icon: <RiEdit2Fill /> }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <FaUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{candidateData?.name || 'Loading...'}</h2>
              <p className="text-sm text-gray-500">{candidateData?.jobTitle || ''}</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                  selectedTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <IconBase className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-5 sticky top-0 z-[999]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidate: {candidateData?.name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidateStatus)}`}>
                  {candidateStatus}
                </span>
                <select 
                  value={candidateStatus}
                  onChange={(e) => setCandidateStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <CiCalendar className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <CiMail className="w-6 h-6 text-blue-600 mr-3" />
                    <span>Send Email</span>
                  </button>
                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <CiPhone className="w-6 h-6 text-green-600 mr-3" />
                    <span>Make Call</span>
                  </button>
                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RiFileTextFill className="w-6 h-6 text-purple-600 mr-3" />
                    <span>View Resume</span>
                  </button>
                </div>
              </div>

              {/* Candidate Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Candidate Information</h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <RiEdit2Line className="w-4 h-4" />}
                    <span>{isEditing ? 'Save' : 'Edit'}</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={candidateData.name}
                          onChange={(e) => setCandidateData({...candidateData, name: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900">{candidateData?.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={candidateData.email}
                          onChange={(e) => setCandidateData({...candidateData, email: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900">{candidateData?.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={candidateData.phone}
                          onChange={(e) => setCandidateData({...candidateData, phone: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900">{candidateData?.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={candidateData?.location}
                          onChange={(e) => setCandidateData({...candidateData, location: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900 flex items-center">
                          <CiMapPin className="w-4 h-4 mr-1 text-gray-500" />
                          {candidateData?.location}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position Applied</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={candidateData?.jobTitle}
                          onChange={(e) => setCandidateData({...candidateData, position: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900 flex items-center">
                          <FaBriefcase className="w-4 h-4 mr-1 text-gray-500" />
                          {candidateData?.jobTitle}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={candidateData?.experience}
                          onChange={(e) => setCandidateData({...candidateData, experience: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900">{candidateData?.experience}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={candidateData?.expectedSalary}
                          onChange={(e) => setCandidateData({...candidateData, expectedSalary: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900">{candidateData?.expectedSalary}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={candidateData?.availabilityNoticePeriod}
                          onChange={(e) => setCandidateData({...candidateData, availability: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      ) : (
                        <p className="text-gray-900">{candidateData?.availabilityNoticePeriod}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Interviews */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Upcoming Interviews</h3>
                <div className="space-y-3">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CiCalendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{meeting.type}</p>
                          <p className="text-sm text-gray-500">{meeting.date} at {meeting.time}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        meeting.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'resume' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Resume & Documents</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <RiFileTextFill className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="font-medium">Resume.pdf</p>
                        <p className="text-sm text-gray-500">Uploaded 2 days ago • 245 KB</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      View
                    </button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <RiFileTextFill className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium">Cover_Letter.pdf</p>
                        <p className="text-sm text-gray-500">Uploaded 2 days ago • 156 KB</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'interviews' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Interview Schedule</h3>
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Schedule New Interview
                </button>
              </div>
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{meeting.type}</h4>
                        <p className="text-sm text-gray-500">
                          <CiLock className="w-4 h-4 inline mr-1" />
                          {meeting.date} at {meeting.time}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">Edit</button>
                        <button className="text-red-600 hover:text-red-700">Cancel</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs content would go here */}
          {(selectedTab === 'communications' || selectedTab === 'notes') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                {selectedTab === 'communications' ? 'Communications History' : 'Notes & Feedback'}
              </h3>
              <p className="text-gray-500">Content for {selectedTab} will be implemented here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Schedule Interview</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
                <select
                  value={newMeeting.type}
                  onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select type</option>
                  <option value="Phone Screening">Phone Screening</option>
                  <option value="Technical Interview">Technical Interview</option>
                  <option value="Behavioral Interview">Behavioral Interview</option>
                  <option value="Final Interview">Final Interview</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer</label>
                <input
                  type="text"
                  value={newMeeting.interviewer}
                  onChange={(e) => setNewMeeting({...newMeeting, interviewer: e.target.value})}
                  placeholder="Interviewer name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleScheduleMeeting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
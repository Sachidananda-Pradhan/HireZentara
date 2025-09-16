import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CandidateDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   const sessionId = useSelector((state) => state.user.sessionId);
  const { candidateId } = useParams();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-green-700 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} overflow-hidden`}>
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-lg font-bold">{isSidebarOpen ? 'Dashboard' : '📋'}</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white focus:outline-none">
            {isSidebarOpen ? '⬅️' : '➡️'}
          </button>
        </div>
        {isSidebarOpen && (
          <ul className="mt-4 space-y-2 px-4">
            <li className="hover:bg-green-600 p-2 rounded cursor-pointer">Overview</li>
            <li className="hover:bg-green-600 p-2 rounded cursor-pointer">Applications</li>
            <li className="hover:bg-green-600 p-2 rounded cursor-pointer">Settings</li>
          </ul>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Candidate: {candidateId}</h1>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Logout</button>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <p className="text-gray-700">Welcome to your dashboard, {candidateId}!</p>
          {/* Add more dashboard widgets or sections here */}
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;
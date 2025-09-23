import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//import { DashboardPage } from "./pages/DashboardPage";
import { Navigate } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage";
import CreateJobPage from "./pages/Jobs/CreateJobPage";
import CandidateListBoard from "./pages/Candidates/CandidateListBoard ";
import CandidateDashboard from "./pages/Candidates/Candidate/candidateDashboard";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/create-job" element={<CreateJobPage/>}/>
   {/* <Route path="/candidates/:jobId" element={<CandidateListBoard />} /> */}
   <Route path="/candidates/:jobId" element={<CandidateListBoard />} />
   <Route path="/candidatedashboard/:candidateId" element={<CandidateDashboard/>}/>


</Routes>
    </BrowserRouter>
    // <div>
    //   //<LoginPage/>
    // </div>
  );
};

export default App;

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   downloadCandidateList,
//   getRegisteredCandidatesByJobId,
// } from "../../services/api";
// import { decryptPayload } from "../../services/encryptionAndDecryption";
// import DeleteCandidate from "./DeleteCandidate";
// import { MdDelete } from "react-icons/md";

// const CandidateListBoard = () => {
//   const sessionId = useSelector((state) => state.user.sessionId);
//   // const { jobId } = useParams();
//   const { jobId } = useParams();

//   const [candidates, setCandidates] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [days, setDays] = useState("7");
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [showStatusDropdown, setShowStatusDropdown] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const[selectedCandidateId,setSelectedCandidateId] =useState(false);

//   const fetchCandidates = async (
//     page = 0,
//     status = statusFilter,
//     sort = sortBy,
//     filterDays = days,
//     keyword = search
//   ) => {
//     if (!jobId) {
//       console.warn("jobId is missing, skipping API call");
//       return;
//     }

//     try {
//       const response = await getRegisteredCandidatesByJobId(sessionId, jobId, {
//         pageNumber: page,
//         sortBy: sort || "",
//         sortFlag: sort ? true : "",
//         days: filterDays || "",
//         search: keyword || "",
//         candidateStatus: status || "",
//       });
//       const decrypted = await decryptPayload(response?.encryptedResponseData);
//       setCandidates(decrypted?.data || []);
//       console.log(decrypted.data);

//       setCurrentPage(decrypted?.currentPageNumber || 0);
//       setTotalPages(decrypted?.totalPageCount || 1);
//     } catch (error) {
//       console.error("Error fetching candidates:", error);
//     }
//   };

//   // Trigger API whenever filter changes
//   useEffect(() => {
//     if (sessionId && jobId) {
//       fetchCandidates(0, statusFilter, sortBy, days, search);
//     }
//   }, [days, search, sortBy, sessionId, jobId]);

//   const handlePageChange = (page) => {
//     if (page >= 0 && page < totalPages) {
//       setCurrentPage(page);
//       fetchCandidates(page);
//     }
//   };

//   const dateFormat = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   const handleDownloadCandidateList = async () => {
//     try {
//       const response = await downloadCandidateList(sessionId, jobId);

//       const blob = new Blob([response.data], {
//         type: response.headers["content-type"],
//       });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;

//       // Optional: Use filename from headers if provided
//       const contentDisposition = response.headers["content-disposition"];
//       const fileNameMatch =
//         contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);
//       const fileName = fileNameMatch
//         ? fileNameMatch[1]
//         : `applied_candidates_${jobId}.xls`;

//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       onClose(); // Close modal or UI if needed
//     } catch (error) {
//       console.error("Download failed:", error);
//     }
//   };

//   const navigate = useNavigate();
//   const navigateToDashboard = (candidateId) => {
//     navigate(`/candidatedashboard/${candidateId}`);
//   };

//   const handleToDeleteCandidate = (candidateId) => {
//     setSelectedCandidateId(candidateId);
//     setShowDeleteModal(true);
//   };

//   return (
//     <main className="p-10 bg-gray-50">
//       <h2 className="text-2xl font-bold text-green-700 mb-6">
//         👥 Registered Candidates for Job : {jobId}
//       </h2>

//       <div className="mb-4 flex justify-between items-center gap-4">
//         <div>
//           <label className="text-sm font-medium text-gray-700 mr-2">
//             Filter by:
//           </label>
//           <select
//             value={days}
//             onChange={(e) => setDays(e.target.value)}
//             className="border rounded px-3 py-1 text-sm w-36 bg-white"
//           >
//             <option value="7">7 Days</option>
//             <option value="30">30 Days</option>
//             <option value="45">45 Days</option>
//             <option value="60">60 Days</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="text"
//             placeholder="🔍 Search mobile no..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="border rounded px-3 py-1 text-sm w-64"
//           />
//           <button
//             onClick={() =>
//               fetchCandidates(0, statusFilter, sortBy, days, search)
//             }
//             className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 text-sm"
//           >
//             Search
//           </button>
//           <button
//             onClick={handleDownloadCandidateList}
//             className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm flex items-center"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth={2}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M12 4v8"
//               />
//             </svg>
//             Download List
//           </button>
//         </div>
//       </div>

//       <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
//         <thead className="bg-green-100 text-green-700">
//           <tr>
//             <th className="px-6 py-3 text-left font-semibold">Name</th>
//             <th className="px-6 py-3 text-left font-semibold">Email</th>
//             <th className="px-6 py-3 text-left font-semibold">AppliedDate</th>
//             <th className="text-left px-6 py-3 font-semibold relative">
//               <button
//                 onClick={() => setShowStatusDropdown((prev) => !prev)}
//                 className="text-indigo-700 font-semibold cursor-pointer flex items-center gap-1"
//               >
//                 Status <span className="text-xs">▼</span>
//               </button>

//               {showStatusDropdown && (
//                 <ul className="absolute z-20 mt-2 bg-white border border-indigo-300 rounded shadow-md w-46 text-sm">
//                   {[
//                     "APPLIED",
//                     "IN_REVIEW",
//                     "SHORTLISTED",
//                     "INTERVIEW_SCHEDULED",
//                     "OFFERED",
//                     "HIRED",
//                     "REJECTED",
//                   ].map((status) => {
//                     const statusColors = {
//                       APPLIED: "text-blue-600",
//                       IN_REVIEW: "text-yellow-600",
//                       SHORTLISTED: "text-purple-600",
//                       INTERVIEW_SCHEDULED: "text-pink-600",
//                       OFFERED: "text-green-600",
//                       HIRED: "text-emerald-600",
//                       REJECTED: "text-red-600",
//                     };

//                     return (
//                       <li
//                         key={status}
//                         onClick={() => {
//                           setStatusFilter(status);
//                           setShowStatusDropdown(false);
//                         }}
//                         className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer uppercase font-semibold ${
//                           statusColors[status]
//                         } ${statusFilter === status ? "bg-indigo-100" : ""}`}
//                       >
//                         {status}
//                       </li>
//                     );
//                   })}
//                 </ul>
//               )}
//             </th>

//             <th className="px-6 py-3 text-left font-semibold">Phone</th>
//             {/* <th className="px-6 py-3 text-left font-semibold">Current📍</th> */}
//             <th className="px-6 py-3 text-left font-semibold">Resume</th>
//             <th className="px-6 py-3 text-left font-semibold">View</th>
//             <th className="px-6 py-3 text-left font-semibold">Delete</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-200">
//           {candidates.map((c, index) => (
//             <tr key={index}>
//               <td className="px-6 py-4 text-sm text-gray-800">{c.name}</td>
//               <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
//               <td className="px-6 py-4 text-sm text-gray-600">
//                 {dateFormat(c.appliedDate)}
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-600">
//                 {c.candidateStatus}
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-600">{c.mobileNo}</td>
//               {/* <td className="px-6 py-4 text-sm text-gray-600">{c.currentLocation}</td> */}
//               <td className="px-6 py-4 text-sm text-gray-600">
//                 <a
//                   href={`data:application/pdf;base64,${c.resume}`}
//                   download={`${c.name}_resume.pdf`}
//                   className="flex items-center text-blue-600 hover:underline"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-1"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M12 4v8"
//                     />
//                   </svg>
//                   Resume
//                 </a>
//               </td>

//               <td className="px-6 py-4 text-sm">
//                 <button
//                   onClick={() => navigateToDashboard(c.candidateId)} // Replace with your routing logic
//                   className="text-blue-600 hover:underline flex items-center"

//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-1"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={2}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                   View
//                 </button>
//               </td>
//               <td className="px-6 py-4 text-sm">
//                 {/* Delete Button */}
//                 <button
//                   onClick={() => handleToDeleteCandidate(c.candidateId)}
//                   className="text-red-600 hover:underline flex items-center">
//                     <MdDelete />
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {showDeleteModal && (
//               <DeleteCandidate
//                 candidateId={selectedCandidateId}
//                 sessionId={sessionId}
//                 onClose={() => {
//                   setShowDeleteModal(false);
//                   fetchCandidates(currentPage);
//                 }}
//               />
//             )}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       <div className="flex justify-center space-x-2 mt-6">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 0}
//           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//         >
//           ⬅ Prev
//         </button>
//         <span className="px-4 py-2 font-semibold text-indigo-700">
//           Page {currentPage + 1} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage + 1 >= totalPages}
//           className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//         >
//           Next ➡
//         </button>
//       </div>
//     </main>
//   );
// };

// export default CandidateListBoard;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  downloadCandidateList,
  getRegisteredCandidatesByJobId,
} from "../../services/api";
import { decryptPayload } from "../../services/encryptionAndDecryption";
import DeleteCandidate from "./DeleteCandidate";
import {
  MdDelete,
  MdLogout,
  MdCalendarToday,
  MdWorkOutline,
} from "react-icons/md";
import { FiDownload, FiSearch, FiEye } from "react-icons/fi";
import LogoutButton from "../Logout";
import Header from "../../componate/Header";
import { FaCalendarDay, FaPager, FaUsers } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";


const CandidateListBoard = () => {
  const sessionId = useSelector((state) => state.user.sessionId);
  const { jobId } = useParams();

  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [days, setDays] = useState("7");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(false);
  const userDetails = useSelector((state) => state.user.userDetails);

  const fetchCandidates = async (
    page = 0,
    status = statusFilter,
    sort = sortBy,
    filterDays = days,
    keyword = search
  ) => {
    if (!jobId) {
      console.warn("jobId is missing, skipping API call");
      return;
    }

    try {
      const response = await getRegisteredCandidatesByJobId(sessionId, jobId, {
        pageNumber: page,
        sortBy: sort || "",
        sortFlag: sort ? true : "",
        days: filterDays || "",
        search: keyword || "",
        candidateStatus: status || "",
      });
      const decrypted = await decryptPayload(response?.encryptedResponseData);
      setCandidates(decrypted?.data || []);
      console.log(decrypted.data);

      setCurrentPage(decrypted?.currentPageNumber || 0);
      setTotalPages(decrypted?.totalPageCount || 1);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    if (sessionId && jobId) {
      fetchCandidates(0, statusFilter, sortBy, days, search);
    }
  }, [days, search, sortBy, sessionId, jobId]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchCandidates(page);
    }
  };

  const dateFormat = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownloadCandidateList = async () => {
    try {
      const response = await downloadCandidateList(sessionId, jobId);

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      const fileNameMatch =
        contentDisposition && contentDisposition.match(/filename="?([^"]+)"?/);
      const fileName = fileNameMatch
        ? fileNameMatch[1]
        : `applied_candidates_${jobId}.xls`;

      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleViewAllInterviews = () => {
    // Navigate to interview list page
    navigate(`/interviews/${jobId}`);
  };

 
  const navigate = useNavigate();
  const navigateToDashboard = (candidateId) => {
    navigate(`/candidatedashboard/${candidateId}`);
  };

  const handleToDeleteCandidate = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setShowDeleteModal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <Header userDetails={userDetails} />
       <div className="max-w-7xl mx-auto py-20">
        {/* Header Section */}
        <div className="mb-6 ">
          <div className="flex items-center gap-3 mb-3 ">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-xl shadow-lg flex items-center gap-4">
            <FaUsers className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Candidate Management
              </h1>
              <p className="text-black font-bold text-md">
                Manage and track all your Candidates
              </p>
            </div>  
            </div>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-indigo-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Candidates for Job ID : {jobId} 
                </p>
                <p className="text-3xl font-bold text-indigo-600">
                  {candidates.length}
                </p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <FaUsers className="w-8 h-8 text-indigo-600" />   
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Current Page
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {currentPage + 1} / {totalPages}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaPager  className="w-8 h-8 text-green-600" /> 
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Filter Period
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {days} Days
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
               <LuCalendarDays className="w-8 h-8 text-purple-600" /> 
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">
                Filter Period:
              </label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="45">Last 45 Days</option>
                <option value="60">Last 60 Days</option>
              </select>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by mobile number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
              <button
                onClick={() =>
                  fetchCandidates(0, statusFilter, sortBy, days, search)
                }
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <FiSearch />
                Search
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleViewAllInterviews}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                <MdCalendarToday className="text-lg" />
                View All Interviews
              </button>

              <button
                onClick={handleDownloadCandidateList}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                <FiDownload className="text-lg" />
                Download List
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider relative">
                    <button
                      onClick={() => setShowStatusDropdown((prev) => !prev)}
                      className="flex items-center gap-2 hover:text-indigo-100 transition-colors"
                    >
                      Status
                      <span className="text-xs">▼</span>
                    </button>

                    {showStatusDropdown && (
                      <ul className="absolute z-20 mt-2 bg-white border-2 border-indigo-300 rounded-lg shadow-xl w-52 text-sm left-0">
                        {[
                          "APPLIED",
                          "IN_REVIEW",
                          "SHORTLISTED",
                          "INTERVIEW_SCHEDULED",
                          "OFFERED",
                          "HIRED",
                          "REJECTED",
                        ].map((status) => {
                          const statusColors = {
                            APPLIED: "text-blue-600 hover:bg-blue-50",
                            IN_REVIEW: "text-yellow-600 hover:bg-yellow-50",
                            SHORTLISTED: "text-purple-600 hover:bg-purple-50",
                            INTERVIEW_SCHEDULED:
                              "text-pink-600 hover:bg-pink-50",
                            OFFERED: "text-green-600 hover:bg-green-50",
                            HIRED: "text-emerald-600 hover:bg-emerald-50",
                            REJECTED: "text-red-600 hover:bg-red-50",
                          };

                          return (
                            <li
                              key={status}
                              onClick={() => {
                                setStatusFilter(status);
                                setShowStatusDropdown(false);
                              }}
                              className={`px-4 py-3 cursor-pointer uppercase font-semibold transition-all ${
                                statusColors[status]
                              } ${
                                statusFilter === status ? "bg-indigo-100" : ""
                              }`}
                            >
                              {status.replace(/_/g, " ")}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    View
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((c, index) => (
                  <tr
                    key={index}
                    className="hover:bg-indigo-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {c.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{c.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {dateFormat(c.appliedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {c.candidateStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{c.mobileNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={`data:application/pdf;base64,${c.resume}`}
                        download={`${c.name}_resume.pdf`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        <FiDownload className="text-lg" />
                        Download
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigateToDashboard(c.candidateId)}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                      >
                        <FiEye className="text-lg" />
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleToDeleteCandidate(c.candidateId)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        <MdDelete className="text-xl" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page{" "}
                  <span className="font-medium">{currentPage + 1}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ← Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-600 text-sm font-medium text-white">
                    {currentPage + 1}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages}
                    className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next →
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
        </div>
      {showDeleteModal && (
        <DeleteCandidate
          candidateId={selectedCandidateId}
          sessionId={sessionId}
          onClose={() => {
            setShowDeleteModal(false);
            fetchCandidates(currentPage);
          }}
        />
      )}
    </main>
  );
};

export default CandidateListBoard;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  downloadCandidateList,
  getRegisteredCandidatesByJobId,
} from "../../services/api";
import { decryptPayload } from "../../services/encryptionAndDecryption";
import DeleteCandidate from "./DeleteCandidate";
import { MdDelete } from "react-icons/md";

const CandidateListBoard = () => {
  const sessionId = useSelector((state) => state.user.sessionId);
  // const { jobId } = useParams();
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
  const[selectedCandidateId,setSelectedCandidateId] =useState(false);

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

  // Trigger API whenever filter changes
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

      // Optional: Use filename from headers if provided
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

      onClose(); // Close modal or UI if needed
    } catch (error) {
      console.error("Download failed:", error);
    }
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
    <main className="p-10 bg-gray-50">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        👥 Registered Candidates for Job : {jobId}
      </h2>

      <div className="mb-4 flex justify-between items-center gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Filter by:
          </label>
          <select
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="border rounded px-3 py-1 text-sm w-36 bg-white"
          >
            <option value="7">7 Days</option>
            <option value="30">30 Days</option>
            <option value="45">45 Days</option>
            <option value="60">60 Days</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="🔍 Search mobile no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1 text-sm w-64"
          />
          <button
            onClick={() =>
              fetchCandidates(0, statusFilter, sortBy, days, search)
            }
            className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 text-sm"
          >
            Search
          </button>
          <button
            onClick={handleDownloadCandidateList}
            className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M12 4v8"
              />
            </svg>
            Download List
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-green-100 text-green-700">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Name</th>
            <th className="px-6 py-3 text-left font-semibold">Email</th>
            <th className="px-6 py-3 text-left font-semibold">AppliedDate</th>
            <th className="text-left px-6 py-3 font-semibold relative">
              <button
                onClick={() => setShowStatusDropdown((prev) => !prev)}
                className="text-indigo-700 font-semibold cursor-pointer flex items-center gap-1"
              >
                Status <span className="text-xs">▼</span>
              </button>

              {showStatusDropdown && (
                <ul className="absolute z-20 mt-2 bg-white border border-indigo-300 rounded shadow-md w-46 text-sm">
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
                      APPLIED: "text-blue-600",
                      IN_REVIEW: "text-yellow-600",
                      SHORTLISTED: "text-purple-600",
                      INTERVIEW_SCHEDULED: "text-pink-600",
                      OFFERED: "text-green-600",
                      HIRED: "text-emerald-600",
                      REJECTED: "text-red-600",
                    };

                    return (
                      <li
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusDropdown(false);
                        }}
                        className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer uppercase font-semibold ${
                          statusColors[status]
                        } ${statusFilter === status ? "bg-indigo-100" : ""}`}
                      >
                        {status}
                      </li>
                    );
                  })}
                </ul>
              )}
            </th>

            <th className="px-6 py-3 text-left font-semibold">Phone</th>
            {/* <th className="px-6 py-3 text-left font-semibold">Current📍</th> */}
            <th className="px-6 py-3 text-left font-semibold">Resume</th>
            <th className="px-6 py-3 text-left font-semibold">View</th>
            <th className="px-6 py-3 text-left font-semibold">Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {candidates.map((c, index) => (
            <tr key={index}>
              <td className="px-6 py-4 text-sm text-gray-800">{c.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {dateFormat(c.appliedDate)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {c.candidateStatus}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{c.mobileNo}</td>
              {/* <td className="px-6 py-4 text-sm text-gray-600">{c.currentLocation}</td> */}
              <td className="px-6 py-4 text-sm text-gray-600">
                <a
                  href={`data:application/pdf;base64,${c.resume}`}
                  download={`${c.name}_resume.pdf`}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3M12 4v8"
                    />
                  </svg>
                  Resume
                </a>
              </td>

              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => navigateToDashboard(c.candidateId)} // Replace with your routing logic
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  View
                </button>
              </td>
              <td className="px-6 py-4 text-sm">
                {/* Delete Button */}
                <button
                  onClick={() => handleToDeleteCandidate(c.candidateId)}
                  className="text-red-600 hover:underline flex items-center">
                    <MdDelete />
                </button>
              </td>
            </tr>
          ))}
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
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          ⬅ Prev
        </button>
        <span className="px-4 py-2 font-semibold text-indigo-700">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 >= totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </main>
  );
};

export default CandidateListBoard;

import React, { useEffect, useState } from "react";
import { getAllJobs } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { decryptPayload } from "../services/encryptionAndDecryption";
import DeleteJob from "../pages/Jobs/Delete";
import UpdateJob from "../pages/Jobs/Update";
import Modal from "./Modal ";
import { useNavigate } from "react-router-dom";

const JobList = () => {
  const dispatch = useDispatch();
  const sessionId = useSelector((state) => state.user.sessionId);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [days, setDays] = useState("7");
  const [search, setSearch] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = async (
    page = 0,
    status = statusFilter,
    sort = sortBy,
    filterDays = days,
    keyword = search
  ) => {
    setLoading(true);
    try {
      const response = await getAllJobs(sessionId, {
        pageNumber: page,
        jobStatus: status,
        sortBy: sort || "",
        sortFlag: sort ? true : "",
        days: filterDays || "",
        search: keyword || "",
      });
      const decrypted = await decryptPayload(response?.encryptedResponseData);
      setJobs(decrypted?.data || []);
      setCurrentPage(decrypted?.currentPageNumber || 0);
      setTotalPages(decrypted?.totalPageCount || 1);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchJobs(currentPage);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchJobs(0, statusFilter, sortBy);
  }, [statusFilter, sortBy]);

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      fetchJobs(page);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const handleUpdateClick = (jobId) => {
    setSelectedJobId(jobId);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (jobId) => {
    setSelectedJobId(jobId);
    setShowDeleteModal(true);
  };

  return (
    <main className="flex-1 p-10 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        {/* Left: Days Dropdown */}
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">
            Filter by:
          </label>
          <select
            value={days}
            onChange={(e) => {
              setDays(e.target.value);
              fetchJobs(0, statusFilter, sortBy, e.target.value, search);
            }}
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
            placeholder="🔍 Search jobId.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1 text-sm w-64"
          />
          <button
            onClick={() => fetchJobs(0, statusFilter, sortBy, days, search)}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded hover:bg-indigo-700 text-sm"
          >
            Search
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading jobs...</div>
      ) : (
        <>
          <div className="overflow-x-auto mb-10 ">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">
              📋 Job List{" "}
            </h2>
            <table className="  min-w-full bg-white rounded-lg shadow-md overflow-hidden ">
              <thead className="bg-indigo-100 text-indigo-700 ">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">
                    Job Title
                  </th>
                  <th className="text-left px-6 py-3 font-semibold">Job ID</th>
                  {/* <th className="text-left px-6 py-3 font-semibold">Status
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-indigo-300 rounded px-2 py-1 text-sm bg-indigo-50 text-indigo-700 font-semibold"
                    >
                      <option value="ALL"> All</option>
                      <option value="OPEN">Open</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </th> */}

                  <th className="text-left px-6 py-3 font-semibold ">
                    <button
                      onClick={() => setShowStatusDropdown((prev) => !prev)}
                      className="text-indigo-700 font-semibold  cursor-pointer flex items-center gap-1"
                    >
                      Status <span className="text-xs">▼</span>
                    </button>

                    {showStatusDropdown && (
                      <ul className="absolute z-20 mt-2 bg-white border border-indigo-300 rounded shadow-md w-32 text-sm text-indigo-700">
                        {["ALL", "OPEN", "CLOSED"].map((status) => (
                          <li
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setShowStatusDropdown(false);
                            }}
                            className={`px-4 py-2 hover:bg-indigo-50 cursor-pointer ${
                              statusFilter === status
                                ? "font-bold bg-indigo-100"
                                : ""
                            }`}
                          >
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </li>
                        ))}
                      </ul>
                    )}
                  </th>

                  <th className="text-left px-6 py-3 font-semibold">Posted</th>
                  <th className="text-left px-6 py-3 font-semibold">
                    Expiring
                  </th>
                  <th className="text-left px-6 py-3 font-semibold">View</th>
                  <th className="text-left px-6 py-3 font-semibold">Update</th>
                  <th className="text-left px-6 py-3 font-semibold">Delete</th>
                  <th className="text-left px-6 py-3 font-semibold">Candiate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.jobId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {job.jobTitle}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {job.jobId}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        onClick={() => setStatusFilter(job.jobStatus)}
                        className={`font-semibold cursor-pointer  ${
                          job.jobStatus === "OPEN"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                        title={`Filter by ${job.jobStatus}`}
                      >
                        {job.jobStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(job.postedDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(job.closingDayofJob)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={job.jobLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Link🔗
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleUpdateClick(job)}
                        className="text-blue-600 hover:underline"
                      >
                        ✏️
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteClick(job.jobId)}
                        className="text-red-600 hover:underline"
                      >
                        🗑️
                      </button>
                    </td>
                    <td>
                    <h3
  onClick={() => navigate(`/candidates/${job.jobId}`)}
  className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm"
>
  👥 Candidate List
</h3>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showUpdateModal && (
              <UpdateJob
                job={selectedJobId}
                sessionId={sessionId}
                onClose={() => {
                  setShowUpdateModal(false);
                  fetchJobs(currentPage);
                }}
              />
            )}

            {showDeleteModal && (
              <DeleteJob
                jobId={selectedJobId}
                sessionId={sessionId}
                onClose={() => {
                  setShowDeleteModal(false);
                  fetchJobs(currentPage);
                }}
              />
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-2">
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
        </>
      )}
    </main>
  );
};

export default JobList;

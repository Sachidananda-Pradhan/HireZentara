import React, { useEffect, useState } from "react";
import { getAllJobs } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { decryptPayload } from "../services/encryptionAndDecryption";
import DeleteJob from "../pages/Jobs/Delete";
import UpdateJob from "../pages/Jobs/Update";
import Modal from "./Modal ";
import { useNavigate } from "react-router-dom";
import {
  MdEdit,
  MdDelete,
  MdVisibility,
  MdPeople,
  MdFilterList,
  MdSearch,
  MdWorkOutline,
  MdCalendarToday,
  MdTrendingUp,
} from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";

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

  const getStatusColor = (status) => {
    return status === "OPEN"
      ? "bg-green-100 text-green-700 border-green-300"
      : "bg-red-100 text-red-700 border-red-300";
  };

  const openJobsCount = jobs.filter((job) => job.jobStatus === "OPEN").length;
  const closedJobsCount = jobs.filter((job) => job.jobStatus === "CLOSED").length;

  return (
    <main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3 py-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <MdWorkOutline className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Job Management
              </h1>
              <p className="text-gray-600 text-sm">
                Manage and track all your job postings
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-indigo-500 transform hover:scale-105 transition-transform">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Jobs</p>
                <p className="text-3xl font-bold text-indigo-600">{jobs.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <MdWorkOutline className="text-2xl text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-green-500 transform hover:scale-105 transition-transform">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Open Jobs</p>
                <p className="text-3xl font-bold text-green-600">{openJobsCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <MdTrendingUp className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-red-500 transform hover:scale-105 transition-transform">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Closed Jobs</p>
                <p className="text-3xl font-bold text-red-600">{closedJobsCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <MdCalendarToday className="text-2xl text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-purple-500 transform hover:scale-105 transition-transform">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">Page</p>
                <p className="text-3xl font-bold text-purple-600">
                  {currentPage + 1}/{totalPages}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <MdFilterList className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-lg 
         mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Days Filter */}
            <div className="flex items-center gap-3">
              <MdFilterList className="text-gray-500 text-xl" />
              <label className="text-sm font-semibold text-gray-700">
                Time Period:
              </label>
              <select
                value={days}
                onChange={(e) => {
                  setDays(e.target.value);
                  fetchJobs(0, statusFilter, sortBy, e.target.value, search);
                }}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-white"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="45">Last 45 Days</option>
                <option value="60">Last 60 Days</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by Job ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
              <button
                onClick={() => fetchJobs(0, statusFilter, sortBy, days, search)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <MdSearch />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-20 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading jobs...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              {/* <div className="overflow-x-auto mb-10"> */}
                <div className=" overflow-x-auto"> 
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Job ID
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
                          <ul className="absolute z-20 mt-2 bg-white border-2 border-indigo-300 rounded-lg shadow-xl w-40 text-sm left-0">
                            {["ALL", "OPEN", "CLOSED"].map((status) => (
                              <li
                                key={status}
                                onClick={() => {
                                  setStatusFilter(status);
                                  setShowStatusDropdown(false);
                                }}
                                className={`px-4 py-3 hover:bg-indigo-50 cursor-pointer text-indigo-700 font-semibold transition-all ${
                                  statusFilter === status
                                    ? "bg-indigo-100"
                                    : ""
                                }`}
                              >
                                {status.charAt(0) + status.slice(1).toLowerCase()}
                              </li>
                            ))}
                          </ul>
                        )}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Posted Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Closing Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        View Link
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                        Actions
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                        Candidates
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr
                        key={job.jobId}
                        className="hover:bg-indigo-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {job.jobTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 font-mono">
                            {job.jobId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border-2 ${getStatusColor(
                              job.jobStatus
                            )} cursor-pointer hover:shadow-md transition-shadow`}
                            onClick={() => setStatusFilter(job.jobStatus)}
                          >
                            {job.jobStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <MdCalendarToday className="text-gray-400" />
                            {formatDate(job.postedDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <MdCalendarToday className="text-gray-400" />
                            {formatDate(job.closingDayofJob)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a
                            href={job.jobLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                          >
                            <FiExternalLink />
                            View Job
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateClick(job)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Job"
                            >
                              <MdEdit className="text-xl" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(job.jobId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Job"
                            >
                              <MdDelete className="text-xl" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => navigate(`/candidates/${job.jobId}`)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-medium"
                          >
                            <MdPeople className="text-lg" />
                            View Candidates
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
                      <span className="font-semibold">{currentPage + 1}</span> of{" "}
                      <span className="font-semibold">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        ← Previous
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-semibold text-white">
                        {currentPage + 1}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage + 1 >= totalPages}
                        className="relative inline-flex items-center px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next →
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
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
    </main>
  );
};

export default JobList;

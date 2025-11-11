import React, { useState, useEffect } from 'react';
import { CiCalendar, CiSearch } from 'react-icons/ci';
import { FaCheckCircle, FaFilter } from 'react-icons/fa';
import { FiAlertCircle, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import Header from '../../componate/Header';
import { useParams } from 'react-router-dom';
import { decryptPayload } from '../../services/encryptionAndDecryption';
import { getInterviewsListByJobId } from '../../services/api';

const InterviewsList = () => {
  const sessionId = useSelector((state) => state.user.sessionId);
  const userDetails = useSelector((state) => state.user.userDetails);
  const { jobId } = useParams();
  
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState({
    pageSize: 10,
    isRecent: true,
    days: 7,
    hours: '',
    interviewStatus: '',
    sortFlag: true,
    sortBy: 'createdAt'
  });

  useEffect(() => {
    fetchInterviews();
  }, [currentPage, filters, searchTerm]);

  const fetchInterviews = async () => {
    if (!jobId) {
      console.warn("jobId is missing, skipping API call");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getInterviewsListByJobId(sessionId, jobId, {
        pageNumber: currentPage,
        pageSize: filters.pageSize,
        sortBy: filters.sortBy || "",
        sortFlag: filters.sortFlag,
        isRecent: filters.isRecent,
        days: filters.days || "",
        hours: filters.hours || "",
        search: searchTerm || "",
        interviewStatus: filters.interviewStatus || "",
      });

      const decrypted = await decryptPayload(response?.encryptedResponseData);
      setInterviews(decrypted?.data || []);
      setCurrentPage(decrypted?.currentPageNumber || 0);
      setTotalPages(decrypted?.totalPageCount || 1);
      setTotalRecords(decrypted?.totalRecords || 0);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      SCHEDULED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <CiCalendar className="w-4 h-4" /> },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', icon: <FaCheckCircle className="w-4 h-4" /> },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', icon: <FiX className="w-4 h-4" /> }
    };
    const config = statusConfig[status] || statusConfig.SCHEDULED;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} flex items-center gap-1 w-fit`}>
        {config.icon}
        {status}
      </span>
    );
  };

  const getPlatformBadge = (platform) => {
    if (!platform) return null;
    const platformColors = {
      'zoom': 'bg-blue-50 text-blue-600 border-blue-200',
      'google meet': 'bg-green-50 text-green-600 border-green-200',
      'microsoft teams': 'bg-purple-50 text-purple-600 border-purple-200'
    };
    const colorClass = platformColors[platform?.toLowerCase()] || 'bg-gray-50 text-gray-600 border-gray-200';
    return (
      <span className={`px-2 py-1 rounded border text-xs font-medium ${colorClass}`}>
        {platform}
      </span>
    );
  };

  // const getModeBadge = (mode) => {
  //   if (!mode) return null;
  //   return mode === 'Virtual' ? (
  //     <span className="px-2 py-1 rounded bg-indigo-50 text-indigo-600 text-xs font-medium">Virtual</span>
  //   ) : (
  //     <span className="px-2 py-1 rounded bg-orange-50 text-orange-600 text-xs font-medium">In-person</span>
  //   );
  // };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFilters({
      pageSize: 10,
      isRecent: true,
      days: 7,
      hours: '',
      interviewStatus: '',
      sortFlag: true,
      sortBy: 'interviewDate'
    });
    setSearchTerm('');
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Header userDetails={userDetails} />
        <div className="max-w-7xl mx-auto pt-20">
          <div className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <Header userDetails={userDetails} />
      <div className="max-w-7xl mx-auto py-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Interview Schedules</h1>
          <p className="text-gray-600 text-sm mt-1">Manage and track all candidate interviews</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, mobile..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Days Filter */}
            <select
              value={filters.days}
              onChange={(e) => handleFilterChange('days', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Days</option>
              <option value="1">Last 24 Hours</option>
              <option value="7">Last 7 Days</option>
              <option value="15">Last 15 Days</option>
              <option value="30">Last 30 Days</option>
            </select>

            {/* Hours Filter */}
            <select
              value={filters.hours}
              onChange={(e) => handleFilterChange('hours', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Hours</option>
              <option value="1">Last 1 Hour</option>
              <option value="2">Last 2 Hours</option>
              <option value="3">Last 3 Hours</option>
              <option value="6">Last 6 Hours</option>
              <option value="12">Last 12 Hours</option>
              <option value="24">Last 24 Hours</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.interviewStatus}
              onChange={(e) => handleFilterChange('interviewStatus', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || filters.interviewStatus || filters.hours || filters.days !== '7') && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <FiX className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Candidate Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Interview Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Interview Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Meeting Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {interviews.length > 0 ? (
                  interviews.map((interview) => (
                    <tr key={interview.interviewId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{interview.candidateName || 'N/A'}</span>
                          <span className="text-xs text-gray-500">{interview.interviewRound || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{interview.candidateMobileNo || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {interview.interviewDate ? formatDate(interview.interviewDate) : 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {interview.interviewStartTime && interview.interviewEndTime 
                              ? `${interview.interviewStartTime} - ${interview.interviewEndTime}`
                              : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(interview.interviewStatus)}
                      </td>
                      <td className="px-6 py-4">
                        {interview.interviewType}
                      </td>
                      <td className="px-6 py-4">
                        {getPlatformBadge(interview.meetingPlatform)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <FiAlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No interviews found</h3>
                      <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {interviews.length > 0 && totalPages > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{currentPage * filters.pageSize + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min((currentPage + 1) * filters.pageSize, totalRecords)}
                </span>{' '}
                of <span className="font-semibold">{totalRecords}</span> results
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx;
                    } else if (currentPage < 3) {
                      pageNum = idx;
                    } else if (currentPage > totalPages - 4) {
                      pageNum = totalPages - 5 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  Next
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewsList;
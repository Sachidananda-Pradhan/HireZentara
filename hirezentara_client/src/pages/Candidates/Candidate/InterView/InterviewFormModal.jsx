import React, { useState, useEffect } from "react";
import { CiCalendar, CiLock, CiMail, CiUser } from "react-icons/ci";
import { FiAlertCircle, FiCheckCircle, FiRotateCcw, FiVideo, FiX } from "react-icons/fi";

const InterviewFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
  mode = "schedule", // "schedule" or "reschedule"
  isLoading = false,
  title,
  submitButtonText,
  currentScheduleInfo = null // For reschedule mode to show current details
}) => {
  const [formData, setFormData] = useState({
    interviewtype: "",
    interviewRound: "",
    interviewDate: "",
    interviewStartTime: "",
    interviewEndTime: "",
    interviewTimeInHR: "",
    meetingPlatform: "",
    interviewName: "",
    interviewEmail: "",
  });
  const [errors, setErrors] = useState({});

  const interviewTypes = [
    { value: "Phone Screening", label: "Phone Screening", icon: "📞" },
    { value: "Technical Interview", label: "Technical Interview", icon: "💻" },
    { value: "Behavioral Interview", label: "Behavioral Interview", icon: "🤝" },
    { value: "Final Interview", label: "Final Interview", icon: "🎯" },
  ];

  const meetingPlatforms = [
    { value: "Zoom", label: "Zoom", icon: "🔵" },
    { value: "Microsoft Teams", label: "Microsoft Teams", icon: "🟣" },
    { value: "Google Meet", label: "Google Meet", icon: "🟢" },
    { value: "In-Person", label: "In-Person", icon: "🏢" },
  ];

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        interviewtype: initialData.interviewtype || initialData.interviewType || "",
        interviewRound: initialData.interviewRound || "",
        interviewDate: initialData.interviewDate || "",
        interviewStartTime: initialData.interviewStartTime || "",
        interviewEndTime: initialData.interviewEndTime || "",
        interviewTimeInHR: initialData.interviewTimeInHR || "",
        meetingPlatform: initialData.meetingPlatform || "",
        interviewName: initialData.interviewName || "",
        interviewEmail: initialData.interviewEmail || "",
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-calculate duration when start/end times change
      if (name === "interviewStartTime" || name === "interviewEndTime") {
        if (updated.interviewStartTime && updated.interviewEndTime) {
          const start = new Date(`1970-01-01T${updated.interviewStartTime}:00`);
          const end = new Date(`1970-01-01T${updated.interviewEndTime}:00`);
          const duration = (end - start) / (1000 * 60 * 60); // in hours
          if (duration > 0) {
            updated.interviewTimeInHR = duration.toFixed(1);
          } else {
            updated.interviewTimeInHR = "";
          }
        }
      }

      return updated;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.interviewtype) newErrors.interviewtype = "Interview type is required";
    if (!formData.interviewDate) newErrors.interviewDate = "Date is required";
    if (!formData.interviewStartTime) newErrors.interviewStartTime = "Start time is required";
    if (!formData.interviewEndTime) newErrors.interviewEndTime = "End time is required";
    if (!formData.meetingPlatform) newErrors.meetingPlatform = "Platform is required";
    if (!formData.interviewName) newErrors.interviewName = "Interviewer name is required";
    if (!formData.interviewEmail) newErrors.interviewEmail = "Interviewer email is required";
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.interviewEmail && !emailRegex.test(formData.interviewEmail)) {
      newErrors.interviewEmail = "Please enter a valid email address";
    }

    // Time validation
    if (formData.interviewStartTime && formData.interviewEndTime) {
      const start = new Date(`1970-01-01T${formData.interviewStartTime}:00`);
      const end = new Date(`1970-01-01T${formData.interviewEndTime}:00`);
      if (end <= start) {
        newErrors.interviewEndTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const FormField = ({ label, error, icon, children, required = false }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-xs">
          <FiAlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );

  const primaryColor = mode === "reschedule" ? "emerald" : "blue";
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`p-2 ${mode === 'reschedule' ? 'bg-emerald-100' : 'bg-blue-100'} rounded-xl`}>
              {mode === 'reschedule' ? 
                <FiRotateCcw className={`w-5 h-5 ${mode === 'reschedule' ? 'text-emerald-600' : 'text-blue-600'}`} /> :
                <CiCalendar className={`w-5 h-5 ${mode === 'reschedule' ? 'text-emerald-600' : 'text-blue-600'}`} />
              }
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {title || (mode === 'reschedule' ? 'Reschedule Interview' : 'Schedule Interview')}
              </h2>
              {mode === 'reschedule' && currentScheduleInfo && (
                <p className="text-sm text-gray-500">
                  Update details for {currentScheduleInfo.interviewType}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            disabled={isLoading}
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Current Details Banner for Reschedule */}
        {mode === 'reschedule' && currentScheduleInfo && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <CiCalendar className="w-4 h-4 text-blue-600" />
              Current Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Date:</span>
                <span className="ml-2 font-medium">{currentScheduleInfo.interviewDate
                        ? new Date(currentScheduleInfo.interviewDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Date not available"}{" "}</span>
              </div>
              <div>
                <span className="text-gray-600">Time:</span>
                <span className="ml-2 font-medium">{currentScheduleInfo.interviewStartTime}</span>
              </div>
              <div>
                <span className="text-gray-600">Platform:</span>
                <span className="ml-2 font-medium">{currentScheduleInfo.meetingPlatform}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{currentScheduleInfo.interviewType}</span>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Interview Type & Round */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Interview Type"
              error={errors.interviewtype}
              icon="🎯"
              required
            >
              <select
                name="interviewtype"
                value={formData.interviewtype}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent transition-all`}
              >
                <option value="">Select interview type</option>
                {interviewTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Interview Round"
              icon="🔢"
            >
              <input
                type="text"
                name="interviewRound"
                value={formData.interviewRound || ""}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent transition-all`}
                placeholder="e.g., Round 1"
              />
            </FormField>
          </div>

          {/* Date */}
          <FormField
            label={mode === 'reschedule' ? "New Interview Date" : "Interview Date"}
            error={errors.interviewDate}
            icon={<CiCalendar className="w-4 h-4 text-blue-600" />}
            required
          >
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent transition-all`}
            />
          </FormField>

          {/* Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Start Time"
              error={errors.interviewStartTime}
              icon={<CiLock className="w-4 h-4 text-green-600" />}
              required
            >
              <input
                type="time"
                name="interviewStartTime"
                value={formData.interviewStartTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent transition-all`}
              />
            </FormField>

            <FormField
              label="End Time"
              error={errors.interviewEndTime}
              icon={<CiLock className="w-4 h-4 text-red-600" />}
              required
            >
              <input
                type="time"
                name="interviewEndTime"
                value={formData.interviewEndTime}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent transition-all`}
              />
            </FormField>

            <FormField
              label="Duration"
              icon={<CiLock className="w-4 h-4 text-purple-600" />}
            >
              <input
                type="text"
                value={formData.interviewTimeInHR ? `${formData.interviewTimeInHR} hrs` : ""}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                placeholder="Auto-calculated"
              />
            </FormField>
          </div>

          {/* Platform */}
          <FormField
            label="Meeting Platform"
            error={errors.meetingPlatform}
            icon={<FiVideo className="w-4 h-4 text-blue-600" />}
            required
          >
            <select
              name="meetingPlatform"
              value={formData.meetingPlatform}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent transition-all`}
            >
              <option value="">Select meeting platform</option>
              {meetingPlatforms.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.icon} {platform.label}
                </option>
              ))}
            </select>
          </FormField>

          {/* Interviewer Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CiUser className="w-4 h-4" />
              Interviewer Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Interviewer Name"
                error={errors.interviewName}
                icon={<CiUser className="w-4 h-4 text-indigo-600" />}
                required
              >
                <input
                  type="text"
                  name="interviewName"
                  value={formData.interviewName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent transition-all`}
                  placeholder="e.g., John Doe"
                />
              </FormField>

              <FormField
                label="Interviewer Email"
                error={errors.interviewEmail}
                icon={<CiMail className="w-4 h-4 text-red-600" />}
                required
              >
                <input
                  type="email"
                  name="interviewEmail"
                  value={formData.interviewEmail}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent transition-all`}
                  placeholder="john.doe@company.com"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-6 py-3 bg-gradient-to-r ${
              mode === 'reschedule' 
                ? 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' 
                : 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            } text-white rounded-xl transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === 'reschedule' ? 'Rescheduling...' : 'Scheduling...'}
              </>
            ) : (
              <>
                <FiCheckCircle className="w-4 h-4" />
                {submitButtonText || (mode === 'reschedule' ? 'Reschedule Interview' : 'Schedule Interview')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFormModal;
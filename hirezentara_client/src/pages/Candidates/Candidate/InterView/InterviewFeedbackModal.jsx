import React, { useState } from 'react';
import { FiCheckCircle, FiSend, FiStar, FiX } from 'react-icons/fi';

const InterviewFeedbackModal = ({ 
  interview, 
  onClose, 
  onSubmitFeedback,
  sessionId 
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    technicalSkills: '',
    communication: '',
    cultureFit: '',
    strengths: '',
    weaknesses: '',
    recommendation: 'PENDING',
    additionalNotes: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async () => {
    if (formData.rating === 0) {
      alert('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with your actual API call
      // await submitInterviewFeedback(sessionId, interview.interviewId, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onSubmitFeedback?.(formData);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <FiStar
              className={`w-8 h-8 ${
                star <= (hoveredRating || formData.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-gray-600 font-medium">
          {formData.rating > 0 ? `${formData.rating}/5` : 'No rating'}
        </span>
      </div>
    );
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Feedback Submitted!
          </h3>
          <p className="text-gray-600">
            Your feedback has been recorded successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Interview Feedback
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {interview.interviewType} - {interview.interviewDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Overall Rating *
            </label>
            {renderStars()}
          </div>

          {/* Technical Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Technical Skills
            </label>
            <textarea
              value={formData.technicalSkills}
              onChange={(e) => setFormData({ ...formData, technicalSkills: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Evaluate technical competency, problem-solving abilities..."
            />
          </div>

          {/* Communication */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Communication Skills
            </label>
            <textarea
              value={formData.communication}
              onChange={(e) => setFormData({ ...formData, communication: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Assess clarity, articulation, listening skills..."
            />
          </div>

          {/* Culture Fit */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Culture Fit
            </label>
            <textarea
              value={formData.cultureFit}
              onChange={(e) => setFormData({ ...formData, cultureFit: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="How well does the candidate align with company values..."
            />
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Strengths
              </label>
              <textarea
                value={formData.strengths}
                onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Notable strengths observed..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Areas for Improvement
              </label>
              <textarea
                value={formData.weaknesses}
                onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Areas that need development..."
              />
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recommendation *
            </label>
            <select
              value={formData.recommendation}
              onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="PENDING">Pending Decision</option>
              <option value="STRONGLY_RECOMMEND">Strongly Recommend</option>
              <option value="RECOMMEND">Recommend</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NOT_RECOMMEND">Do Not Recommend</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Any other observations or comments..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || formData.rating === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedbackModal;
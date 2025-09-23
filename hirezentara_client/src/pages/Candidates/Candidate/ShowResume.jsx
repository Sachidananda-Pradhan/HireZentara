import React from 'react';

const ShowResume = ({ isOpen, onClose, resume }) => {
  if (!isOpen || !resume) return null; // Early return if not open or no resume

  // Construct data URL for Base64 PDF
  const pdfDataUrl = `data:application/pdf;base64,${resume}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 ></h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close resume viewer"
          >
            ✕
          </button>
        </div>
        <div>
          {resume ? (
            <div className="mt-4">
              <a
                href={pdfDataUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                download="candidate_resume.pdf"
              >
                Download Resume
              </a>
              <iframe
                src={pdfDataUrl}
                title="Candidate Resume"
                className="w-full h-96 mt-4 border"
                aria-label="Preview of candidate resume"
                style={{ minHeight: '500px' }} // Ensure sufficient height for PDF
                onError={() => alert('Failed to load PDF preview. Please download the file.')}
              />
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No resume available for preview.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowResume;
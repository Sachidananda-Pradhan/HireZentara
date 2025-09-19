import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { deleteCandidateById } from '../../services/api';
import { decryptPayload } from '../../services/encryptionAndDecryption';

const DeleteCandidate = ({ candidateId, onClose }) => {
  const sessionId = useSelector((state) => state.user.sessionId);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await deleteCandidateById(sessionId, candidateId);
      const encryptedResponseData = response?.data?.encryptedResponseData;

    // Decrypt the payload
    const decrypted = await decryptPayload(encryptedResponseData);

    console.log('Decrypted response:', decrypted);


      
      setPopupMessage(decrypted || 'Candidate deleted successfully');
      setShowPopup(true);
    } catch (error) {
      console.error(error);
      setPopupMessage('Error deleting candidate');
      setShowPopup(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete candidate ID: {candidateId}?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md text-center">
            <p className="text-lg font-medium text-gray-800">{popupMessage}</p>
            <button
              onClick={() => {
                setShowPopup(false);
                onClose(); // Close modal after showing message
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteCandidate;
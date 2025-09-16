import React from "react";
import { useSelector } from "react-redux";
import { DeleteJobs } from "../../services/api";

const DeleteJob = ({ jobId, onClose }) => {
  const sessionId = useSelector((state) => state.user.sessionId);

  const handleDelete = async () => {
    try {
      await DeleteJobs(jobId, sessionId);
      onClose();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p className="mb-4">Are you sure you want to delete job ID: {jobId}?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteJob;
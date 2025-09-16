import React, { useState } from "react";
import { useSelector } from "react-redux";
import { updateJob } from "../../services/api";

const UpdateJob = ({ job, onClose }) => {
  const [expiringDate, setExpiringDate] = useState("");
  const sessionId = useSelector((state) => state.user.sessionId);

  const handleUpdate = async () => {
    try {
      await updateJob(job.jobId, sessionId, expiringDate);
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Update Job</h2>
         {/* Display Job Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <div className="border rounded px-3 py-2 bg-gray-100 text-gray-800 text-sm">
            {job.jobTitle}
          </div>
        </div>

        {/* Input for Expiry Extension */}
        <input
          placeholder="Add number of days to extend"
          value={expiringDate}
          onChange={(e) => setExpiringDate(e.target.value)}
          className="border w-full p-2 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateJob;
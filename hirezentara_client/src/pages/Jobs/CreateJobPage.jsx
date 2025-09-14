import React, { useState } from "react";
import { useSelector } from "react-redux";
import { decryptPayload, encryptPayload } from "../../services/encryptionAndDecryption";
import { createJobPost } from "../../services/api";
import { useNavigate } from "react-router-dom";


const CreateJobPage = ({onSuccess}) => {
    const sessionId = useSelector((state) => state.user.sessionId);
     const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    location: "",
    rolesAndResponsibilities: [""],
    skillsAndExperience: [""],
    expiringDayOfJob: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const encryptedRequestData = await encryptPayload(formData);
      const result = await createJobPost(encryptedRequestData, sessionId);
       const encryptedResponseData = result?.encryptedResponseData;
          const decrypted = await decryptPayload(encryptedResponseData);
          const {jobLink } = decrypted;

      setResponseMessage(`✅ Job created successfully! Response: ${JSON.stringify(jobLink)}`);
      // navigate("/dashboard");
      if (onSuccess) onSuccess(); // Close modal

    } catch (error) {
      console.error("Error creating job:", error);
      setResponseMessage(responseMessage?.response?.data?.error?.message||"❌ Failed to create job. Please try again.");
    }
  };


  return (
    
    <div className="p-10 bg-gray-50  ">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">🧾 Create Job Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="jobDescription" placeholder="Job Description" value={formData.jobDescription} onChange={handleChange} className="w-full p-2 border rounded" />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea type="text" name="rolesAndResponsibilities" placeholder="Roles & Responsibilities (comma separated)" value={formData.rolesAndResponsibilities} onChange={(e) => setFormData({ ...formData, rolesAndResponsibilities: e.target.value.split(",") })} className="w-full p-2 border rounded" />
        <textarea type="text" name="skillsAndExperience" placeholder="Skills & Experience (comma separated)" value={formData.skillsAndExperience} onChange={(e) => setFormData({ ...formData, skillsAndExperience: e.target.value.split(",") })} className="w-full p-2 border rounded" />
        <input type="text" name="expiringDayOfJob" placeholder="days" value={formData.expiringDayOfJob} onChange={handleChange} className="w-full p-2 border rounded" />

        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
          Create Post
        </button>
      </form>

      {responseMessage && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default CreateJobPage;
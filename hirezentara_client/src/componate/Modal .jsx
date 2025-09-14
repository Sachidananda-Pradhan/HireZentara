import React, { useEffect } from "react";
import CreateJobPage from "../pages/Jobs/CreateJobPage";

const Modal = ({ title, children, onClose }) => {

    useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);
  return (
    <div className="fixed  inset-0  bg-opacity-50 flex  justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 h-min-screen relative">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
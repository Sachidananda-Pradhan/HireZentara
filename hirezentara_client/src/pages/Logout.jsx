import React from "react";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../services/api";
import { clearUser } from "../redux/userSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionId = useSelector((state) => state.user.sessionId);

  const handleLogout = async () => {
    try {
      await logoutUser(sessionId);
      dispatch(clearUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
    >
      <MdLogout className="text-lg" />
      <span className="font-medium hidden sm:inline">Logout</span>
    </button>
  );
};

export default LogoutButton;
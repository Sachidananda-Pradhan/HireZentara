// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getLoggedInUserDetails, logoutUser } from "../services/api";
// import { decryptPayload } from "../services/encryptionAndDecryption";
// import { clearUser, setUserDetails } from "../redux/userSlice";
// import Header from "../componate/Header";
// import Sidebar from "../componate/Sidebar";
// import JobList from "../componate/JobList";
// // import Header from "../components/Header";
// // import Sidebar from "../components/Sidebar";
// // import PostList from "../components/PostList";

// const DashboardPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const sessionId = useSelector((state) => state.user.sessionId);
//   const userDetails = useSelector((state) => state.user.userDetails);
//   // const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
//    const [isCollapsed, setIsCollapsed] = useState(false);
//   const [activeModal, setActiveModal] = useState(null);
// ; // 'create', 'update', 'delete'

//   const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await getLoggedInUserDetails(userDetails?.userName, sessionId);
//         const decrypted = await decryptPayload(response?.encryptedResponseData);
//         dispatch(setUserDetails(decrypted));
//       } catch (err) {
//         console.error("Error fetching user details:", err);
//       }
//     };

//     if (userDetails?.userName && sessionId) {
//       fetchUserDetails();
//     }
//   }, [userDetails?.userName, sessionId, dispatch]);

//   const handleLogout = async () => {
//     try {
//       await logoutUser(sessionId);
//       dispatch(clearUser());
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header userDetails={userDetails} handleLogout={handleLogout} />
//       <div className="flex flex-1">
//         {/* <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} /> */}
//         <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} setActiveModal={setActiveModal} />
//         <JobList/>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedInUserDetails, logoutUser } from "../services/api";
import { decryptPayload } from "../services/encryptionAndDecryption";
import { clearUser, setUserDetails } from "../redux/userSlice";
import Header from "../componate/Header";
import Sidebar from "../componate/Sidebar";
import JobList from "../componate/JobList";
import Modal from "../componate/Modal ";
import CreateJobPage from "./Jobs/CreateJobPage";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionId = useSelector((state) => state.user.sessionId);
  const userDetails = useSelector((state) => state.user.userDetails);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'create', 'update', 'delete'

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getLoggedInUserDetails(userDetails?.userName, sessionId);
        const decrypted = await decryptPayload(response?.encryptedResponseData);
        dispatch(setUserDetails(decrypted));
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    if (userDetails?.userName && sessionId) {
      fetchUserDetails();
    }
  }, [userDetails?.userName, sessionId, dispatch]);

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
    <div className="min-h-screen flex flex-col">
      <Header userDetails={userDetails} handleLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          setActiveModal={setActiveModal}
        />
        <JobList />
      </div>

      {/* Modals */}
      {activeModal === "create" && (
        <Modal title="Create Job" onClose={() => setActiveModal(null)}>

          <CreateJobPage onSuccess={() => setActiveModal(null)}/>
         
        </Modal>
      )}

      {activeModal === "update" && (
        <Modal title="Update Job" onClose={() => setActiveModal(null)}>
          <form>
            <input type="text" placeholder="Job ID" className="w-full mb-3 px-3 py-2 border rounded" />
            <input type="text" placeholder="New Title" className="w-full mb-3 px-3 py-2 border rounded" />
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Update
            </button>
          </form>
        </Modal>
      )}

      {activeModal === "delete" && (
        <Modal title="Delete Job" onClose={() => setActiveModal(null)}>
          <form>
            <input type="text" placeholder="Job ID to delete" className="w-full mb-3 px-3 py-2 border rounded" />
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Delete
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;
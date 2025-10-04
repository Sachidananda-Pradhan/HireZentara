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

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getLoggedInUserDetails, logoutUser } from "../services/api";
// import { decryptPayload } from "../services/encryptionAndDecryption";
// import { clearUser, setUserDetails } from "../redux/userSlice";
// import Header from "../componate/Header";
// import Sidebar from "../componate/Sidebar";
// import JobList from "../componate/JobList";
// import Modal from "../componate/Modal ";
// import CreateJobPage from "./Jobs/CreateJobPage";

// const DashboardPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const sessionId = useSelector((state) => state.user.sessionId);
//   const userDetails = useSelector((state) => state.user.userDetails);

//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [activeModal, setActiveModal] = useState(null); // 'create', 'update', 'delete'

//   const toggleSidebar = () => setIsCollapsed((prev) => !prev);

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
//         <Sidebar
//           isCollapsed={isCollapsed}
//           toggleSidebar={toggleSidebar}
//           setActiveModal={setActiveModal}
//         />
//         <JobList />
//       </div>

//       {/* Modals */}
//       {activeModal === "create" && (
//         <Modal title="Create Job" onClose={() => setActiveModal(null)}>

//           <CreateJobPage onSuccess={() => setActiveModal(null)}/>
         
//         </Modal>
//       )}  
//     </div>
//   );
// };

// export default DashboardPage;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LoginUserDetails } from "./LoginUserDetails";
import Header from "../componate/Header";
import Sidebar from "../componate/Sidebar";
import JobList from "../componate/JobList";
import Modal from "../componate/Modal ";
import CreateJobPage from "./Jobs/CreateJobPage";


const DashboardPage = () => {
  const userDetails = useSelector((state) => state.user.userDetails);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  
  LoginUserDetails();
  
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header userDetails={userDetails} />  
      
      <div className="flex flex-1 pt-20"> {/* Added pt-20 to account for fixed header */}
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          setActiveModal={setActiveModal}
        />
        
        <main 
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? 'ml-20' : 'ml-48'
          } `}
        >
          <JobList />
        </main>
      </div>

      {/* Modals */}
      {activeModal === "create" && (
        <Modal title="Create New Job" onClose={() => setActiveModal(null)}>
          <CreateJobPage onSuccess={() => setActiveModal(null)} />
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;
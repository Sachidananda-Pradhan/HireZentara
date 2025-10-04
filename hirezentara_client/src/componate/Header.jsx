// import React from "react";

// const Header = ({ userDetails, handleLogout }) => {
//   return (
//     <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
//       <div className="flex items-center space-x-4 text-indigo-700 font-semibold">
//         <span>👤 {userDetails?.firstName}</span>
//       </div>
//       <div className="flex items-center space-x-4">
//         <button className="text-gray-600 hover:text-indigo-700">
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//           </svg>
//         </button>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from "react";
import { MdNotifications } from "react-icons/md";
import LogoutButton from "../pages/Logout";

const Header = ({ userDetails }) => {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Recruitment Portal
            </h1>
            <p className="text-xs text-gray-500">Manage your hiring process</p>
          </div>
        </div>
        
        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MdNotifications className="text-2xl text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                {userDetails?.firstName || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {userDetails?.roles?.roleName || "Administrator"}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
              {(userDetails?.firstName || "U")[0].toUpperCase()}
            </div>
          </div>
          
          {/* Logout Button */}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
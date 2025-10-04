 import React from "react";
// import { useNavigate } from "react-router-dom";

// const Sidebar = ({ isCollapsed, toggleSidebar }) => {
//   const navigate = useNavigate();

//   const menuItems = [
//     { icon: '🧾', label: 'CreatePost', path: '/create-job' },
//     { icon: '✏️', label: 'Update', path: '/update-job' },
//     { icon: '🗑️', label: 'DeleteJob', path: '/delete-job' },
//   ];

//   const handleNavigation = (path) => {
//     navigate(path);
//     // Optional: trigger API call here if needed
//     // e.g., fetchJobDetails(path) or dispatch Redux action
//   };

//   return (
//     <aside className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-indigo-100 p-4`}>
//       <button onClick={toggleSidebar} className="mb-6 text-indigo-700 hover:text-indigo-900 focus:outline-none">
//         {isCollapsed ? '➡️' : '⬅️'}
//       </button>

//       <nav className="space-y-4 text-indigo-700 font-medium">
//         {menuItems.map(({ icon, label, path }) => (
//           <div
//             key={label}
//             onClick={() => handleNavigation(path)}
//             className="flex items-center space-x-2 cursor-pointer hover:text-indigo-900"
//           >
//             <span>{icon}</span>
//             {!isCollapsed && <span>{label}</span>}
//           </div>
//         ))}
//       </nav>
//     </aside>
//   );
// };
// import React from "react";

// const Sidebar = ({ isCollapsed, toggleSidebar, setActiveModal }) => {
//   const menuItems = [
//     { icon: '🧾', label: 'CreatePost', action: () => setActiveModal('create') },
//     // { icon: '✏️', label: 'Update', action: () => setActiveModal('update') },
//     // { icon: '🗑️', label: 'DeleteJob', action: () => setActiveModal('delete') },
//   ];

//   return (
//     <aside className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-indigo-100 p-4`}>
//       <button
//         onClick={toggleSidebar}
//         className="mb-6 text-indigo-700 hover:text-indigo-900 focus:outline-none"
//       >
//         {isCollapsed ? '➡️' : '⬅️'}
//       </button>

//       <nav className="space-y-4 text-indigo-700 font-medium">
//         {menuItems.map(({ icon, label, action }) => (
//           <div
//             key={label}
//             onClick={action}
//             className="flex items-center space-x-2 cursor-pointer hover:text-indigo-900"
//           >
//             <span>{icon}</span>
//             {!isCollapsed && <span>{label}</span>}
//           </div>
//         ))}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;

import { MdAdd,MdChevronLeft,MdChevronRight,} from "react-icons/md";

const Sidebar = ({ isCollapsed, toggleSidebar, setActiveModal }) => {
  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-45"
      } bg-white shadow-xl border-r border-gray-200 fixed left-0 top-20 bottom-0 transition-all duration-300 z-40`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white border-2 border-gray-200 rounded-full p-1 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-md"
      >
        {isCollapsed ? (
          <MdChevronRight className="text-gray-600" />
        ) : (
          <MdChevronLeft className="text-gray-600" />
        )}
      </button>

      {/* Create Job Button */}
      <div className={`p-4 ${isCollapsed ? "px-2" : ""}`}>
        <button
          onClick={() => setActiveModal("create")}
          className={`w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all ${
            isCollapsed ? "p-3" : "px-4 py-3"
          } flex items-center justify-center gap-2 font-semibold`}
        >
          <MdAdd className="text-2xl" />
          {!isCollapsed && <span>Create Job</span>}
        </button>
      </div>

      {/* Navigation Menu
      <nav className="px-3 py-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              item.active
                ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-semibold shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <item.icon className="text-2xl flex-shrink-0" />
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav> */}
    </aside>
  );
};

export default Sidebar;
// import React from "react";
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
import React from "react";

const Sidebar = ({ isCollapsed, toggleSidebar, setActiveModal }) => {
  const menuItems = [
    { icon: '🧾', label: 'CreatePost', action: () => setActiveModal('create') },
    // { icon: '✏️', label: 'Update', action: () => setActiveModal('update') },
    // { icon: '🗑️', label: 'DeleteJob', action: () => setActiveModal('delete') },
  ];

  return (
    <aside className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-indigo-100 p-4`}>
      <button
        onClick={toggleSidebar}
        className="mb-6 text-indigo-700 hover:text-indigo-900 focus:outline-none"
      >
        {isCollapsed ? '➡️' : '⬅️'}
      </button>

      <nav className="space-y-4 text-indigo-700 font-medium">
        {menuItems.map(({ icon, label, action }) => (
          <div
            key={label}
            onClick={action}
            className="flex items-center space-x-2 cursor-pointer hover:text-indigo-900"
          >
            <span>{icon}</span>
            {!isCollapsed && <span>{label}</span>}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
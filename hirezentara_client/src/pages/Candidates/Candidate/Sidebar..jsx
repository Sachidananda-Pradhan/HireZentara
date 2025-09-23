import React from "react";

const Sidebar = ({ selectedTab, setSelectedTab, candidateData, sidebarItems }) => {
  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Candidate Info Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            {candidateData?.name?.[0] || 'C'}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {candidateData?.name || 'Loading...'}
            </h2>
            <p className="text-sm text-gray-500">
              {candidateData?.jobTitle || 'Candidate'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="mt-6 flex-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedTab(item.id)}
            aria-current={selectedTab === item.id ? 'page' : undefined}
            className={`w-full flex items-center px-6 py-6 text-left transition-colors duration-200 ${
              selectedTab === item.id
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="ml-3">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

// import React from "react";

// const Sidebar = ({ selectedTab, setSelectedTab, candidateData, sidebarItems }) => {
//   return (
//     <div className="w-72 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl h-full flex flex-col relative overflow-hidden">
//       {/* Decorative Background Elements */}
//       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-20 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
      
//       {/* Candidate Info Header */}
//       <div className="p-8 border-b border-slate-700/50 relative z-10">
//         <div className="flex items-center space-x-4">
//           {/* Enhanced Avatar */}
//           <div className="relative">
//             <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-blue-500/20">
//               {candidateData?.name?.[0] || 'C'}
//             </div>
//             {/* Online Status Indicator */}
//             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-slate-900 shadow-lg">
//               <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
//             </div>
//           </div>
          
//           <div className="flex-1 min-w-0">
//             <h2 className="font-bold text-white text-lg truncate">
//               {candidateData?.name || 'Loading...'}
//             </h2>
//             <p className="text-slate-300 text-sm truncate">
//               {candidateData?.jobTitle || 'Candidate Profile'}
//             </p>
//             <div className="flex items-center mt-1">
//               <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
//               <span className="text-xs text-green-400 font-medium">Active</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <nav className="mt-4 flex-1 px-4 relative z-10">
//         <div className="space-y-2">
//           {sidebarItems.map((item, index) => (
//             <button
//               key={item.id}
//               onClick={() => setSelectedTab(item.id)}
//               className={`group w-full flex items-center px-4 py-4 text-left transition-all duration-300 ease-out transform hover:scale-[1.02] relative overflow-hidden rounded-xl ${
//                 selectedTab === item.id
//                   ? "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-xl shadow-blue-500/25 backdrop-blur-sm border border-blue-400/30"
//                   : "text-slate-300 hover:bg-white/10 hover:text-white backdrop-blur-sm border border-transparent hover:border-white/10"
//               }`}
//               style={{
//                 animationDelay: `${index * 0.1}s`
//               }}
//             >
//               {/* Animated Background for Active State */}
//               {selectedTab === item.id && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90">
//                   <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
//                 </div>
//               )}
              
//               {/* Icon Container */}
//               <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
//                 selectedTab === item.id
//                   ? "bg-white/20 shadow-lg"
//                   : "bg-white/5 group-hover:bg-white/10"
//               }`}>
//                 <span className={`text-lg transition-all duration-300 ${
//                   selectedTab === item.id 
//                     ? "text-white scale-110" 
//                     : "text-slate-400 group-hover:text-white group-hover:scale-105"
//                 }`}>
//                   {item.icon}
//                 </span>
//               </div>
              
//               {/* Label */}
//               <span className={`relative z-10 ml-4 font-medium transition-all duration-300 ${
//                 selectedTab === item.id
//                   ? "text-white"
//                   : "text-slate-300 group-hover:text-white"
//               }`}>
//                 {item.label}
//               </span>
              
//               {/* Active Indicator */}
//               {selectedTab === item.id && (
//                 <div className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
//               )}
              
//               {/* Hover Effect Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
//             </button>
//           ))}
//         </div>
//       </nav>

//       {/* Bottom Decoration */}
//       <div className="p-6 relative z-10">
//         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
//               <span className="text-white text-sm">✓</span>
//             </div>
//             <div>
//               <p className="text-white text-sm font-medium">All Set!</p>
//               <p className="text-slate-400 text-xs">Profile Complete</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Animated Border */}
//       <div className="absolute inset-0 rounded-l-none">
//         <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-transparent to-purple-500/20 opacity-50"></div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
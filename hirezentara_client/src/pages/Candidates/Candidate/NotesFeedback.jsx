import React from 'react'

const NotesFeedback = () => {
  return (
    <div>NotesFeedback</div>
  )
}

export default NotesFeedback;



// import React from "react";
// import { motion } from "framer-motion";
// import { MdMotionPhotosAuto } from "react-icons/md";

// // Placeholder for NeonButton (define this component as needed)
// const NeonButton = ({ children, variant, size }) => (
//   <button className={`neon-button ${variant} ${size}`}>{children}</button>
// );

// const NotesFeedback = () => {
//   return (
//     <div className="relative min-h-screen overflow-hidden bg-black text-white">
//       {/* Background Image (Constant across layers) */}
//       <div className="absolute inset-0 z-0">
//         <img
//           src="https://framerusercontent.com/images/8bMn7TConezqJdjZpYBriubco.jpeg"
//           alt="Hero background"
//           className="w-full h-full object-cover"
//           sizes="100vw"
//           srcSet="
//             https://framerusercontent.com/images/8bMn7TConezqJdjZpYBriubco.jpeg?scale-down-to=512 512w,
//             https://framerusercontent.com/images/8bMn7TConezqJdjZpYBriubco.jpeg?scale-down-to=1024 1024w,
//             https://framerusercontent.com/images/8bMn7TConezqJdjZpYBriubco.jpeg?scale-down-to=2048 2048w,
//             https://framerusercontent.com/images/8bMn7TConezqJdjZpYBriubco.jpeg?scale-down-to=4096 4096w,
//             https://framerusercontent.com/images/8bMn7TConezqJdjZpYBriubco.jpeg 7680w
//           "
//         />
//       </div>

//       {/* Fixed Translucent Header */}
//       <motion.header
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b border-gray-700"
//       >
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring" }}
//               className="flex items-center space-x-2"
//             >
//               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
//               <span className="text-xl font-bold text-white">CYNTCH</span>
//             </motion.div>

//             <nav className="hidden md:flex items-center space-x-8">
//               {["About", "Services", "Pricing", "Contact"].map(
//                 (item, index) => (
//                   <motion.a
//                     key={item}
//                     initial={{ y: -20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.3 + index * 0.1 }}
//                     href={`#${item.toLowerCase()}`}
//                     className="text-white/80 hover:text-purple-400 transition-colors relative group"
//                   >
//                     {item}
//                     <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
//                   </motion.a>
//                 )
//               )}
//             </nav>
//           </div>
//         </div>
//       </motion.header>

//       {/* Hero Section */}
//       <motion.div
//         className="min-h-screen w-full flex items-center justify-center pt-24 px-14 py-16 relative z-10"
//         initial={{ opacity: 0, x: '-50%', y: -100 }}
//         animate={{ opacity: 1, x: 0, y: 0 }}
//         transition={{ duration: 0.8, ease: 'easeOut' }}
//       >
//         <motion.section
//           className="w-full"
//           initial={{ opacity: 0.6, y: 60 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1, delay: 0.2 }}
//         >
//           <div className="bg-gray-800 p-8 py-10 rounded-lg shadow-lg border border-gray-900 opacity-60">
//             <div className="">
//               {/* <MdMotionPhotosAuto className="text-white text-5xl mb-4" /> */}
//               <h1 className="text-3xl font-bold text-white-900 px-0 py-0">SERVICE</h1>
//               <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white py-10">
//                 Comprehensive Innovative Software Solutions
//               </h1>
//             </div>
//             <p className="text-lg text-white mt-4 ">
//               We specialize in providing innovative software solutions that empower
//               businesses to streamline operations.
//             </p>
//           </div>
//         </motion.section>
//       </motion.div>

//       Services and Image Layer
//       <motion.div
//         className="w-full flex justify-center mt-16  relative z-9 py-0"
//         initial={{ opacity: 0, y: 60 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1, delay: 0.6 }}
//       >

 
//           {/* Services Section */}
//           <div className="w-full bg-black px-8 py-8">
//             <div className="container mx-auto ">
//               <div className="shadow-lg">
//                 <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white">
//                   Transforming Businesses with{' '}
//                 </h2>
//                 <span className="text-blue-600 text-3xl">Cutting-Edge Solutions</span>
//                 <h4 className="text-xl md:text-3xl mt-4 text-white">
//                   We offer extensive expertise through our proprietary framework called Business Driven Architecture. This framework empowers us to deliver comprehensive solutions in process and development, establishing the basis for our leadership across a wide range of Microsoft technologies.
//                 </h4>
//                 <h4 className="text-xl md:text-3xl mt-4 text-white">
//                   Our capabilities span from CRM and ERP to Low-code/No-code development, Azure cloud platform, security, as well as the implementation and maintenance of crucial IT solutions.
//                 </h4>
//               </div>
//             </div>


//           {/* Image Content */}
//           <div className="flex-1 flex justify-center items-center py-8">
//             <div className="relative w-full mx-auto">
//               <img
//                 src="https://framerusercontent.com/images/mJTmYHPqOlv8L0oOgY4jhEEtcg.png"
//                 alt="Services Illustration"
//                 className="w-full h-auto object-cover rounded-lg transform hover:-translate-y-1 transition-transform duration-300"
//               />
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default NotesFeedback;


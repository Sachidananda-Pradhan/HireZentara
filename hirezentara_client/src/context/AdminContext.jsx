// import { createContext } from "react";
// import { loginUser } from "../services/api";

//  export const AdminContext = createContext()
//  const AdminProvider=(props)=>{
//     const value ={
//         loginUser

//     }
//     return(
//         <AdminContext.Provider value={value}>
//             {props.children}
//         </AdminContext.Provider>
//     )
    
//  }
//  export default AdminProvider;



import { createContext, useState } from "react";
import { loginUser } from "../services/api";

export const AdminContext = createContext();

const AdminProvider = (props) => {
  const [sessionId, setSessionId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const value = {
    loginUser,
    sessionId,
    setSessionId,
    userDetails,
    setUserDetails,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;


// import { createContext, useState } from "react";
// import { loginUser } from "../services/api";

// export const AdminContext = createContext();

// const AdminProvider = (props) => {
//   const [sessionId, setSessionId] = useState(null);

//   const value = {
//     loginUser,
//     sessionId,
//     setSessionId,
//   };

//   return (
//     <AdminContext.Provider value={value}>
//       {props.children}
//     </AdminContext.Provider>
//   );
// };

// export default AdminProvider;



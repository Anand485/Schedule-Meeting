// import React, { useEffect, useState } from "react";
// import { GoogleLogin } from "react-google-login";
// import CalendarView from "./Components/CalendarView/CalendarView";
// import DateSelector from "./Components/DateSelector/DateSelector";
// import "./App.css"; // Corrected import statement
// import axios from "axios";

// import { jwtDecode } from "jwt-decode";

// function App() {
//   const  [user, setUser]  = useState({});

//   function handleCallbackResponse(response) {
//     console.log("Token \t\t" + response);
//     let userObject = jwtDecode(response.credential);
//     console.log(userObject);
//     setUser(userObject);
//   }

//   // useEffect should be written correctly
//   useEffect(() => {
//     /* global google */
//     try {
//       google.accounts.id.initialize({
//         client_id:
//           "262733146670-9fjqg16nsq8of4g0h6va4etcehppfo3k.apps.googleusercontent.com",
//         callback: handleCallbackResponse, // Callback should be a function
//       });
//     } catch (error) {}

//     google.accounts.id.renderButton(document.getElementById("signInDiv"), {
//       theme: "outline",
//       size: "large",
//     });
//   }, []); // Empty dependency array

//   return (
//     <div className="App">


// <div className="flex items-center justify-between p-4 bg-gray-800">
//       <div className="text-white">
//         Welcome, {user.name} 
//       </div>
//       <div className="relative">
//         <img
//           src={user.picture} 
//           alt="User Avatar"
//           className="w-10 h-10 rounded-full cursor-pointer"
//         />
//       </div>
//     </div>

//     <div className=""></div>

// {user ? (
//   <>
//     <CalendarView />
//     <DateSelector />
//   </> 
// ) : (
//   <div className="wrapper">
//     <div id="signInDiv" className=""></div>
//   </div>
// )}

      

      
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import CalendarView from "./Components/CalendarView/CalendarView";
import DateSelector from "./Components/DateSelector/DateSelector";
import "./App.css"; // Corrected import statement
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function App() {
  const [user, setUser] = useState({});

  function handleCallbackResponse(response) {
    console.log("Token \t\t" + response);
    let userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
  }

  useEffect(() => {
    const authenticateWithBackend = async () => {
      try {
        const response = await axios.get("http://localhost:8000/", {
          withCredentials: true, // Include credentials for cross-origin requests
        });

        const userObject = jwtDecode(response.data.token);
        setUser(userObject);
      } catch (error) {
        console.error("Error authenticating with backend:", error);
        // Handle authentication error, e.g., redirect to login page
      }
    };

    authenticateWithBackend();
  }, []);
  // Logout function
  const handleLogout = () => {
    setUser({});
    // Add any additional logic to clear session or perform other logout tasks
  };

  return (
    <div className="App">
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="text-white">
          Welcome, {user.name}
        </div>
        <div className="relative">
          <img
            src={user.picture}
            alt="User Avatar"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
        </div>
        <button onClick={handleLogout} className="text-white">
          Logout
        </button>
      </div>

      {user.name ? (
        <>
          <CalendarView />
          <DateSelector />
        </>
      ) : (
        <div className="wrapper">
          <div id="signInDiv" className=""></div>
        </div>
      )}
    </div>
  );
}

export default App;

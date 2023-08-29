import axios from "axios";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/users/Register";


export default function App() {
  // holds the user data after we fetch it with the token
  const [user, setUser] = useState({});
  // we need a state variable to make sure our async requests finish before we render routes
  const [loaded, setLoaded] = useState(false);

  // on page load we want the user data if they have a token in local storage already
  async function getUser(token) {
    try {
      // attach the token to the header for the middleware authentication
      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // if successful save the user data in the state
      setUser(response.data);
    } catch (error) {
      console.log(error.message);
      // if there is a problem, then destroy the token
      localStorage.removeItem("token");
    }
    // change the state of our loading variable so the routes enable
    setLoaded(true);
  }

  useEffect(() => {
    // on page load get the token from local storage 
    let token = localStorage.getItem("token")
    // if there is a token run the getUser function with it, else set the state so the routes become functional
    if (token) {
      getUser(token)
    } else {
      setLoaded(true)
    }
  }, []);

  // saving the user name from state into a variable to pass as props and condionally render routes
  let loggedInUser = user.username

  return (
    <div className="flex flex-col items-center bg-slate-600 h-screen">
      <Navbar username={loggedInUser} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Navigate />} />
        {loggedInUser ? 
          <>
          </> 
          : 
          <>
            <Route path='/register' element={<Register setUser={setUser} />} />
          </>
        }
      </Routes>
    </div>
  );
}

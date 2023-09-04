import axios from "axios";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/users/Register";
import Login from "./pages/users/Login";
import Edit from "./pages/posts/Edit";
import Index from "./pages/posts/Index";
import New from "./pages/posts/New";
import Show from "./pages/posts/Show";
import Profile from "./pages/users/Profile";

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
    let token = localStorage.getItem("token");
    // if there is a token run the getUser function with it, else set the state so the routes become functional
    if (token) {
      getUser(token);
    } else {
      setLoaded(true);
    }
  }, []);
  

  // saving the user name from state into a variable to pass as props and condionally render routes
  let loggedInUser = user.username;
  
  return (
    <div className="flex flex-col items-center bg-ghost bg-center md:bg-cover text-white min-h-screen">
      <Navbar user={user} setUser={setUser}/>
      <Routes>
        {/* these routes are open to anyone but have to make sure the state variable has been updated to pass props */}
        {loaded && (
          <>
            <Route path="/" element={<Navigate to="/posts" />} />
            <Route path="/posts" element={<Index user={user}/>} />
            <Route
              path="/posts/:id"
              element={<Show user={user} setUser={setUser}/>}
            />
          </>
        )}

        {loggedInUser ? (
          //these routes require you to be logged in
          <>
            <Route
              path="/posts/new"
              element={<New  user={user} setUser={setUser}/>}
            />
            <Route
              path="/posts/:id/edit"
              element={<Edit username={loggedInUser} setUser={setUser}/>}
            />
            <Route path="/profile" element={<Profile user={user} setUser={setUser}/>}/>
            {/* once the useEffect has completed, with a user token, redirect all unspecified routes to the main page */}
            {loaded && <Route path="*" element={<Navigate to="/posts" />} />}
          </>
        ) : (
          //until logged in, only allow the login/register routes and redirect everything else
          <>
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            {/* once the useEffect has completed, if there is no user token, redirect all undeclared routes to login */}
            {loaded && <Route path="*" element={<Navigate to="/login" />} />}
          </>
        )}
      </Routes>
    </div>
  );
}

import { Link } from "react-router-dom";
import { User } from "react-feather";
import Candy from "./Candy";

export default function Navbar({ user, setUser }) {
  // simple logout function, clears the state variable and deletes the token => this causes all the routes to change
  function logout() {
    localStorage.removeItem("token");
    setUser({});
  }

  return (
    <nav className="w-screen bg-black/90 rounded-b-xl ">
      <ul className="flex flex-row items-center  justify-evenly p-1">
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        {user.username ? (
          <>
            <li>
              <Link to="/profile" className="flex items-center group">
                <div className="bg-user group-hover:bg-user-plus w-6 h-6 text-white mx-1 " />{" "}
                {user.username} <Candy />
                {user.candyPoints}
              </Link>
            </li>
            <li onClick={logout}>
              <Link to="/posts" className="hover:underline">
                Logout
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register" className="hover:underline ">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

import { Link } from "react-router-dom";

export default function Navbar({ user, setUser }) {
  // simple logout function, clears the state variable and deletes the token => this causes all the routes to change
  function logout() {
    localStorage.removeItem("token");
    setUser({});
  }

  return (
    <nav className="w-screen bg-slate-700">
      <ul className="flex flex-row justify-evenly p-1">
        <li>
          <Link to="/">Home</Link>
        </li>
        {user.username ? (
          <>
            <li>Welcome {user.username} you have {user.candyPoints} points</li>
            <li onClick={logout}>
              <Link to="/posts">Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

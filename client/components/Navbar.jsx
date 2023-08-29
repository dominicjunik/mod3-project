import { Link } from "react-router-dom";

export default function Navbar({ username, setUser }) {
  // simple logout function, clears the state variable and deletes the token => this causes all the routes to change

  return (
    <div className="flex w-screen">
      <ul className="bg-slate-700 w-screen justify-between">
        <li>
          <Link to="/">Home</Link>
        </li>
        {username ? (
          <></>
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
    </div>
  );
}

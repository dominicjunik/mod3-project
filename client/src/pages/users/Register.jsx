import axios from '../../api'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// declaring an object with all the form values empty for the default state
let emptyForm = {
  username: "",
  password: "",
  email: "",
};

export default function Register({ setUser }) {
  // to redirect after form submission
  const navigate = useNavigate();
  // state variable to control the form values
  let [form, setForm] = useState(emptyForm);

  // function to update state when a form is changed
  function handleChange(event) {
    // spread the form and then edit the relevent keys using bracket object notation
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    // ALWAYS PREVENT THE RELOAD
    event.preventDefault();

    try {
      // step 1: we make a request to create a new user
      const authResponse = await axios.post("/auth/register", form);
      // extract the token from the response of the register
      const token = authResponse.data.token;

      // if theres no token, reset form and stop the function
      if (!token) {
        setForm(emptyForm);
        return;
      }
      // save the token in local storage
      localStorage.setItem("token", token);

      //step 2: using the token in local storage we make a request to get the user information
      const userResponse = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // save the user data in the state
      setUser(userResponse.data);
      // redirect to the main page
      navigate("/posts");
    } catch (error) {
      console.log(error.message);
      alert("username already exists");
    }
  }
  return (
    <div className="flex flex-col items-center min-h-full">
      <h1 className="mt-8 mb-4 sm:mt-36 text-4xl bg-black/90 px-2 pb-1 rounded-lg ">
        Register
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-screen items-center"
      >
        <label
          htmlFor="username"
          className="text-xl bg-black/90 rounded-lg px-2 mb-1"
        >
          Username:
        </label>

        <input
          type="text"
          id="username"
          name="username"
          onChange={handleChange}
          className="p-1 rounded-lg bg-black/80"
          value={form.username}
        />

        <label
          htmlFor="email"
          className="text-xl bg-black/90 rounded-lg px-2 mt-2 mb-1"
        >
          Email:
        </label>

        <input
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          className="p-1 rounded-lg bg-black/80"
          value={form.email}
        />

        <label
          htmlFor="password"
          className="text-xl bg-black/90 rounded-lg px-2 mt-2 mb-1"
        >
          Password:
        </label>

        <input
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
          className="p-1 rounded-lg bg-black/80"
          value={form.password}
        />

        <button className="m-2 text-2xl bg-black/90 hover:bg-black/80 px-2 rounded-lg border border-transparent hover:border-white">
          Submit
        </button>
      </form>
    </div>
  );
}

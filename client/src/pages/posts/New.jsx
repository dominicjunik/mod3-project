import axios from "../../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Candy from "../../components/Candy";
import { Loader } from "react-feather";

export default function New({ user, setUser }) {
  // state variable to control the loading after button press
  const [loading, setLoading] = useState(false);
  // state variable to save the form data
  const [form, setForm] = useState({});
  // to redirect after submission
  const navigate = useNavigate();

  // function to handle the inputs of the form
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  // function to send the created post to the server
  async function handleSubmit(e) {
    // page reload bad
    e.preventDefault();
    // enable spinner
    setLoading(true);
    try {
      // create an object of user data for the solvedBy array
      let userObj = {
        username: user.username,
        trick: form.trick,
        correct: true,
      };
      // create the post structure from the form and add the username
      let newPost = { ...form, createdBy: user.username };
      // push user into solvedBy array so they cannot solve their own post
      newPost.solvedBy = [];
      newPost.solvedBy.push(userObj);
      // create a variable to see if the user is wagering more than they have
      const balance = user.candyPoints - newPost.candyPoints;
      // if they are kick them out of the request with an alert message
      if (balance < 0) {
        //spinner off
        setLoading(false)
        return alert("not enough candy, visit profile page to get more!");
      }
      // send create request to the server with our token
      await axios.post("/api/posts/", newPost, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // update the users local state so the displays show properly
      setUser({ ...user, candyPoints: balance });
      navigate("/posts");
      console.log(newPost);
    } catch (error) {
      console.log(error.message);
      alert("Session expired: You must login before creating a post");
      logout();
      navigate("/login");
    }
    //spinner off
    setLoading(false);
  }

  // simple logout function, clears the state variable and deletes the token => this causes all the routes to change
  function logout() {
    localStorage.removeItem("token");
    setUser({});
  }

  return (
    <div className="flex flex-col items-center min-h-full">
      <h1 className="mt-8 mb-4 sm:mt-36 text-4xl bg-black/90 px-2 pb-1 rounded-lg ">
        Create a Trick or Treat
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-screen items-center"
      >
        <label
          htmlFor="teaser"
          className="text-xl bg-black/90 rounded-lg px-2 "
        >
          Set the scene:
        </label>
        <textarea
          name="teaser"
          id="teaser"
          cols="50"
          rows="4"
          className="p-1 rounded-lg max-w-full bg-black/80"
          required
          onChange={handleChange}
          placeholder="You see an old crooked house with an overgrown lawn, a single light illuminates a pumpkin filled with candy on the doorstep..."
        />

        <fieldset className="m-2">
          <legend className="text-xl bg-black/90 rounded-lg px-2 ">
            Is this a Trick or a Treat?
          </legend>
          <div className="flex justify-center bg-black/80 rounded-lg text-lg">
            <label htmlFor="trick">Trick</label>
            <input
              type="radio"
              id="trick"
              name="trick"
              value={true}
              required
              onChange={handleChange}
            />
            <p className="mx-2">or</p>
            <label htmlFor="treat">Treat</label>
            <input
              type="radio"
              id="treat"
              name="trick"
              value={false}
              onChange={handleChange}
            />
          </div>
        </fieldset>
        <label
          htmlFor="candyPoints"
          className="text-xl bg-black/90 rounded-lg px-2 flex"
        >
          How much candy is at stake?
          <Candy />
        </label>
        <input
          type="number"
          name="candyPoints"
          id="candyPoints"
          placeholder="10"
          required
          className="p-1 rounded-lg max-w-full bg-black/80"
          onChange={handleChange}
        />
        <label
          htmlFor="correctGuess"
          className="text-xl bg-black/90 rounded-lg px-2 mt-2"
        >
          If they guess correct?
        </label>
        <textarea
          name="correctGuess"
          id="correctGuess"
          cols="50"
          rows="2"
          className="p-1 rounded-lg max-w-full bg-black/80"
          required
          onChange={handleChange}
          placeholder="The motherload! fullsized candy bars with a note saying, take as many as you want :)"
        />
        <label
          htmlFor="wrongGuess"
          className="text-xl bg-black/90 rounded-lg px-2 mt-2"
        >
          If they get it wrong...
        </label>
        <textarea
          name="wrongGuess"
          id="wrongGuess"
          cols="50"
          rows="2"
          className="p-1 rounded-lg max-w-full bg-black/80"
          required
          onChange={handleChange}
          placeholder="Too easy, must be a trap. You notice a few blocks later your candy bag is strangely lighter..."
        />
        {loading ? (
          <div className="m-2 text-2xl bg-black/90 hover:bg-black/80 p-1 px-8 rounded-lg border border-transparent ">
            <Loader className="animate-spin-slow" />
          </div>
        ) : (
          <button className="m-2 text-2xl bg-black/90 hover:bg-black/80 px-2 rounded-lg border border-transparent hover:border-white">
            Create
          </button>
        )}
      </form>
    </div>
  );
}

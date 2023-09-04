import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Edit({ username, setUser }) {
  const [loaded, setLoaded] = useState(false);
  // state variable to save the post data inside then update with the the form data
  const [form, setForm] = useState({});
  // saving the database object id from the url parameters
  const { id } = useParams();
  // to redirect after submission
  const navigate = useNavigate();

  // function to request the post data from the server
  async function getPost() {
    try {
      // get request with the url params saved into a variable
      const response = await axios.get(`/api/posts/${id}`);
      console.log(response);
      // post data saved to state
      setForm(response.data);
      if (username !== response.data.createdBy) {
        console.log("bad user");
        navigate("/posts");
      }
    } catch (error) {
      console.log(error);
      // if the request sends a Bad Request error, redirect to the index
      if (error.request.status === 400) {
        navigate("/posts");
      }
    }
    setLoaded(true);
  }

  // on page load get the post data
  useEffect(() => {
    getPost();
  }, []);

  // simple logout function, clears the state variable and deletes the token => this causes all the routes to change
  function logout() {
    localStorage.removeItem("token");
    setUser({});
  }

  // function to handle the inputs of the form
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  //handle the update
  // function to send the updated post to the server
  async function handleSubmit(e) {
    // page reload bad
    e.preventDefault();
    try {
      // spread the original post data into the new object, then spread the updated form inputs
      let updatedPost = { ...form };
      console.log(updatedPost);
      // send create request to the server with our token
      await axios.put(`/api/posts/${id}`, updatedPost, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/posts");
      //   console.log(updatedPost);
    } catch (error) {
      console.log(error.message);
      alert("Session expired: You must login before editting this post");
      logout();
    }
  }

  // displays the edit page
  function showEdit() {
    return (
      <div className="flex flex-col items-center min-h-full">
        <h1 className="mt-8 mb-4 sm:mt-36 text-4xl bg-black/90 px-2 pb-1 rounded-lg ">
          Edit Post
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
            className="p-1 rounded-lg bg-black/80"
            required
            onChange={handleChange}
            defaultValue={form.teaser}
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
                defaultChecked={form.trick === true}
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
                defaultChecked={form.trick === false}
                onChange={handleChange}
              />
            </div>
          </fieldset>
          <label
            htmlFor="candyPoints"
            className="text-xl bg-black/90 rounded-lg px-2 flex"
          >
            How much candy is at stake?
          </label>
          <input
            type="number"
            name="candyPoints"
            id="candyPoints"
            required
            className="p-1 rounded-lg bg-black/80"
            defaultValue={form.candyPoints}
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
            className="p-1 rounded-lg bg-black/80"
            required
            defaultValue={form.correctGuess}
            onChange={handleChange}
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
            className="p-1 rounded-lg bg-black/80"
            required
            defaultValue={form.wrongGuess}
            onChange={handleChange}
          />
          <button className="m-2 text-2xl bg-black/90 hover:bg-black/80 px-2 rounded-lg border border-transparent hover:border-white">
            Update
          </button>
        </form>
      </div>
    );
  }

  return loaded ? showEdit() : <>Loading...</>;
}

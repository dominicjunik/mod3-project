import axios from "../../api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "react-feather";
import Candy from "../../components/Candy";

export default function Edit({ username, setUser }) {
  // state variable to control the loading after button press
  const [loading, setLoading] = useState(false);
  // to conditionally render the page if the data takes a second
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
    // turn on spinner
    setLoading(true);
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
    //turn off spinner
    setLoading(false);
  }

  // displays the edit page
  function showEdit() {
    return (
      <div className="flex flex-col items-center min-h-full">
        <h1 className="mt-8 mb-4 sm:mt-36 text-4xl bg-black/90 px-2 pb-1 rounded-lg ">
          Edit Post
        </h1>
        <div
            className="text-2xl items-center bg-black/90 rounded-lg px-3 py-1 mb-2 flex"
          >
            {form.candyPoints}<Candy/>
          </div>
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
            className="p-1 rounded-lg max-w-full bg-black/80"
            required
            defaultValue={form.wrongGuess}
            onChange={handleChange}
          />
          {loading ? (
            <div className="m-2 text-2xl bg-black/90 hover:bg-black/80 p-1 px-8 rounded-lg border border-transparent ">
              <Loader className="animate-spin-slow" />
            </div>
          ) : (
            <button className="m-2 text-2xl bg-black/90 hover:bg-black/80 px-2 rounded-lg border border-transparent hover:border-white">
              Update
            </button>
          )}
        </form>
      </div>
    );
  }

  return loaded ? (
    showEdit()
  ) : (
    <>
      <Loader className="animate-spin-slow" />
    </>
  );
}

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function New({ username, user, setUser }) {
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
    try {
      // create the post structure from the form and add the username
      let newPost = { ...form, createdBy: user.username };
      // create a variable to see if the user is wagering more than they have
      const balance = user.candyPoints - newPost.candyPoints
      // if they are kick them out of the request with an alert message
      if (balance < 0){
        return alert('not enough candy, go get more!')
      }
      // send create request to the server with our token
      await axios.post("/api/posts/", newPost, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // update the users local state so the displays show properly
      setUser({...user, candyPoints: balance})
      navigate('/posts')
      //   console.log(newPost);
    } catch (error) {
      console.log(error.message);
     // alert('please login again')
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1>Create a Trick or Treat</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-screen items-center"
      >
        <label htmlFor="teaser">Set the scene:</label>
        <textarea
          name="teaser"
          id="teaser"
          cols="50"
          rows="4"
          className="p-1"
          required
          onChange={handleChange}
          placeholder="You see an old crooked house with an overgrown lawn, a single light illuminates a pumpkin filled with candy on the doorstep..."
        />

        <fieldset>
          <legend>Is this a Trick or a Treat?</legend>
          <div className="flex justify-center">
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
        <label htmlFor="candyPoints">How much candy is at stake?</label>
        <input
          type="number"
          name="candyPoints"
          id="candyPoints"
          placeholder="10"
          required
          onChange={handleChange}
        />
        <label htmlFor="correctGuess">If they guess correct?</label>
        <textarea
          name="correctGuess"
          id="correctGuess"
          cols="50"
          rows="2"
          className="p-1"
          required
          onChange={handleChange}
          placeholder="The motherload! fullsized candy bars with a note saying, take as many as you want :)"
        />
        <label htmlFor="wrongGuess">If they get it wrong...</label>
        <textarea
          name="wrongGuess"
          id="wrongGuess"
          cols="50"
          rows="2"
          className="p-1"
          required
          onChange={handleChange}
          placeholder="Better safe than sorry. Live to treat another day."
        />
        <button className="text-2xl">Create</button>
      </form>
    </div>
  );
}

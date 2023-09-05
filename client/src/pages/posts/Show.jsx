import axios from '../../api'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Candy from "../../components/Candy";

export default function Show({ user, setUser }) {
  const [loaded, setLoaded] = useState(false);
  // state variable to save the post data inside
  const [post, setPost] = useState({});
  // state variable for rendering the Trick Or Treat spoiler of the post
  const [tot, setTot] = useState({});
  // saving the database object id from the url parameters
  const { id } = useParams();
  // to redirect if they try and go to a post with a bad id
  const navigate = useNavigate();
  // function to request the post data from the server
  async function getPost() {
    try {
      // get request with the url params saved into a variable
      const response = await axios.get(`/api/posts/${id}`);
      console.log(response);
      // post data saved to state
      setPost(response.data);
      // isolate the solved by array
      let solvedBy = response.data.solvedBy;
      // find if the user has solved this post before
      const prevSolve = solvedBy.find(
        (person) => person.username === user.username
      );
      // console.log(prevSolve);
      if (prevSolve.username) {
        console.log("you already solved this one");
        setTot(prevSolve);
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

  // function to reveal the spoiler
  async function makeGuess(totBool) {
    // first check if they can make the wager
    if (user.candyPoints - post.candyPoints < 0) {
      return alert("Not enough candy to gamble");
    }
    // evaluate if the guess is correct or not
    let correct = totBool === post.trick;
    // format the data into the object for the solvedBy array
    let guess = {
      username: user.username,
      trick: totBool,
      correct,
    };
    // next spread the user and the post into new objects to be updated and then saved back into state
    let updatedUser = { ...user };
    let updatedPost = { ...post };
    // save the user guess info into the post
    updatedPost.solvedBy.push(guess);
    console.log(updatedPost);
    // add/subract points based on their guess and save that into the user
    if (guess.correct) {
      updatedUser.candyPoints += post.candyPoints;
    } else {
      updatedUser.candyPoints -= post.candyPoints;
    }
    let betPackage = {
      updatedPost,
      updatedUser,
      correct,
    };
    console.log(betPackage);
    try {
      // send a bet request to the server with our super object
      const betResponse = await axios.put(`/api/posts/${id}/bet`, betPackage, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(betResponse);
    } catch (error) {
      alert("You must register or login before playing");
      logout();
      navigate("/login");
      console.log(error.message);
      return;
    }
    // update the states so the front end renders everything
    setUser(updatedUser);
    setTot(guess);
    setPost(updatedPost);
  }

  // function to delete the post if the user owns it
  async function deletePost() {
    try {
      await axios.delete(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      alert("Session expired: You must login before deleting this post");
      logout();
      navigate("/login");
      console.log(error.message);
      return;
    }
    navigate("/posts");
  }

  ///////////
  // COULD USE AN IS LOADING FUNCTION SO THE PAGE DOESNT CRASH ON A BAD ID
  return (
    <div className=" min-h-full max-w-lg">
      <div className="bg-black/90 rounded-2xl mt-8 sm:mt-40 p-4 flex flex-col items-center">
        {tot.username ? (
          <>
            <div
              className={`flex flex-col items-center ${
                tot.correct ? "text-green-600" : "text-red-700"
              }`}
            >
              <p className="flex items-center text-lg">
                {tot.correct ? "+" : "-"}
                {post.candyPoints}
                <Candy />
              </p>
              <p>{post.teaser}</p>
              <p>
                {/* display the corresponding message based on if they guessed correctly */}
                {tot.correct ? post.correctGuess : post.wrongGuess}
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="flex items-center">
              {post.candyPoints}
              <Candy />
            </p>
            <p>{post.teaser}</p>
            <div className="flex justify-center">
              <button
                onClick={() => makeGuess(true)}
                className="m-4 px-2 rounded-lg border border-transparent hover:border-white"
              >
                Trick
              </button>
              <button
                onClick={() => makeGuess(false)}
                className="m-4 px-2 rounded-lg border border-transparent hover:border-white"
              >
                Treat
              </button>
            </div>
          </>
        )}
      </div>
      {/* if the user exists and matches the post created by -> render edit/delete buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => navigate(`/posts/`)}
          className="m-2 bg-black/90 hover:bg-black/80 px-2 rounded-lg border border-transparent hover:border-white"
        >
          Back
        </button>
        {user.username === post.createdBy && user.username !== undefined ? (
          <div className="flex justify-end">
            <button
              onClick={() => navigate(`/posts/${id}/edit`)}
              className="m-2 bg-black/90 hover:bg-black/80 px-2 rounded-lg border border-transparent hover:border-white"
            >
              Edit
            </button>
            <button
              onClick={deletePost}
              className="m-2 bg-black/90 hover:bg-black/80 px-2 rounded-lg border border-transparent hover:border-white"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

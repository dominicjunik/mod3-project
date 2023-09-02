import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Show({ username }) {
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
      const prevSolve = solvedBy.find((user) => user.username === username);
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

  // function to reveal the spoiler
  async function makeGuess(totBool) {
    // evalute if the guess is correct or not
    let correct = totBool === post.trick;
    // format the data into the object for the solvedBy array
    let guess = {
      username,
      trick: totBool,
      correct,
    };
    let updatedPost = { ...post };
    updatedPost.solvedBy.push(guess);
    console.log(updatedPost);
    try {
      // send a put request to update the post with the user selection
      const response = await axios.put(`/api/posts/${id}`, updatedPost, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
    } catch (error) {
      alert("You must register or login before playing");

      console.log(error.message);
    }
    // setTot is supposed to be an object and you are making it a boolean

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
      console.log(error.message);
    }
    navigate("/posts");
  }

  ///////////
  // COULD USE AN IS LOADING FUNCTION SO THE PAGE DOESNT CRASH ON A BAD ID
  return (
    <div className=" min-h-screen">
      <div className="bg-slate-700 m-4 p-2">
        <div className="flex">
          <p>{post.teaser}</p>
          <p className="ml-4">{post.candyPoints}pts</p>
        </div>
        {tot.username ? (
          <>
            <div className="flex flex-col items-center justify-center">
              <p>{post.spoiler}</p>
              {/* based on guess text color -> correct green, wrong red*/}
              <p className={tot.correct ? "text-green-500" : "text-red-500"}>
                {/* display the corresponding message based on if they guessed correctly */}
                {tot.correct ? post.correctGuess : post.wrongGuess}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <button onClick={() => makeGuess(true)} className="m-4">
                Trick
              </button>
              <button onClick={() => makeGuess(false)} className="mx-4">
                Treat
              </button>
            </div>
          </>
        )}

        {/* <div className="flex justify-end">
          <button>+{post.likes}</button>
          <button className="ml-2">-{post.dislikes}</button>
        </div> */}
      </div>
      {/* if the user exists and matches the post created by -> render edit/delete buttons */}
      {username === post.createdBy && username !== undefined ? (
        <>
          <button onClick={() => navigate(`/posts/${id}/edit`)}>Edit</button>{" "}
          <button onClick={deletePost}>Delete</button>
        </>
      ) : null}
    </div>
  );
}

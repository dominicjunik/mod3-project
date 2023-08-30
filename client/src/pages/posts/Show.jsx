import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Show({ username }) {
  // state variable to save the post data inside
  const [post, setPost] = useState({});
  // state variable for rendering the Trick Or Treat spoiler of the post
  const [tot, setTot] = useState({});
  // saving the database object id from the url parameters
  const { id } = useParams();
  // function to request the post data from the server
  async function getPost() {
    try {
      // get request with the url params saved into a variable
      const response = await axios.get(`/api/posts/${id}`);
      // console.log(response)
      // post data saved to state
      response.data;
      setPost(response.data);
      let solvedBy = response.data.solvedBy;
      const prevSolve = solvedBy.find((user) => user.username === username);
      console.log(prevSolve);
      if (prevSolve.username) {
        console.log("you already solved this one");
        setTot(prevSolve);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  // on page load get the post data
  useEffect(() => {
    getPost();
  }, []);


  // function to reveal the spoiler
  async function makeGuess(totBool) {
    
    let guess = {
        username,
        trick: totBool
    }
    let updatedPost = {...post}
    updatedPost.solvedBy.push(guess)
    console.log(updatedPost)
    try {
        // send a put request to update the post with the user selection
        const response = await axios.put(`/api/posts/${id}`, updatedPost, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(response)
    } catch(error) {
        console.log(error.message)
    }
    setTot(totBool)
  }

  return (
    <div className="m-4 bg-slate-700 p-2">
      <div className="flex">
        <p>{post.teaser}</p>
        <p className="ml-4">{post.candyPoints}pts</p>
      </div>
      {tot.username ? (
        <>
          <div className="flex flex-col items-center justify-center">          
            <p>{post.spoiler}</p>
            <p className={tot.trick === post.trick ? 'text-green-500': 'text-red-500'}>It was a {post.trick ? "Trick": "Treat"}</p>
          </div>
        </>
      ) : (
        <>
        <div className="flex justify-center">
            <button onClick={() => makeGuess(true)} className="m-4">Trick</button>
            <button onClick={() => makeGuess(false)} className="mx-4">Treat</button>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button>+{post.likes}</button>
        <button className="ml-2">-{post.dislikes}</button>
      </div>
    </div>
  );
}

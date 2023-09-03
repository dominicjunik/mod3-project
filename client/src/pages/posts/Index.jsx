import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Candy from "../../components/Candy";

export default function Index({ user }) {
  // this will store the posts from the DB to map onto the page
  const [posts, setPosts] = useState([]);
  // navigate for button routing
  const navigate = useNavigate();

  async function seed() {
    try {
      await axios.post("/api/posts/seed");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getPosts() {
    try {
      // request all the posts from the database
      const response = await axios.get("/api/posts");
      console.log(response.data);
      // save them in state
      setPosts(response.data);
    } catch (error) {
      console.log(error.message);
    }
  }
  // on page load make the database call
  useEffect(() => {
    getPosts();
  }, []);
  console.log(user);
  return (
    <div className="flex flex-col justify-center">  
      <h1 className="text-center m-4 font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-br from-black to-yellow-800 font-outline-2">
        TRICK OR TWEET
      </h1>
      <button onClick={() => seed()} className="">Seed</button>
      {user.username ? (
        <button onClick={() => navigate("/posts/new")} className="m-2 p-2 rounded-2xl border-transparent border-2 hover:border-white  bg-black/90 hover:bg-black/80">NEW TRICK-OR-TWEET</button>
      ) : null}
      <div className="">
        {posts.map((post, i) => {
          // if the logged in user has solved this post save the data into this variable
          let solved = post.solvedBy.find(
            (peep) => peep.username === user.username
          );

          console.log(solved);
          return (
            <Link
              key={i}
              to={`/posts/${post._id}`}
              className=" flex m-4 flex-row group"
            >
              {solved ? (
                <>
                  <div
                    className={`flex flex-wrap items-center justify-center border-2 border-black font-semibold group-hover:border-white ${
                      solved.correct ? ` bg-gradient-to-tl from-black to-green-500/90` : `bg-gradient-to-tl from-black to-red-600/90`
                    } w-20 h-20 rounded-full m-2 text-center bg-black/90 `}
                  >
                    <p className="flex items-center min-w-0 break-words m-2 text-xl">
                      {/* conditional rendering to display if the user won or lost points on a post, no symbol for own posts */}
                      {post.createdBy !== user.username &&
                        (solved.correct ? "+" : "-")}
                      {post.candyPoints}<Candy/>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`flex flex-wrap items-center justify-center border-2 border-transparent group-hover:border-white group-hover:bg-black/80 bg-black/90 w-20 h-20 rounded-full m-2 text-center `}
                  >
                    <p className="flex items-center min-w-0 break-words m-2 text-xl">
                      {post.candyPoints}<Candy />
                    </p>
                  </div>
                </>
              )}

              <div className="flex flex-col justify-between border-2 border-transparent group-hover:border-white bg-black/90 group-hover:bg-black/80 m-2 p-2 w-10/12 md:w-96  rounded-2xl">
                <p>{post.teaser}</p>
                {console.log(post.createdBy, user.username)}
                {/* display "You" instead of your username if it is your post */}
                <div className="flex justify-between">
                  <span className="text-left">
                    guesses: {post.solvedBy.length}
                  </span>
                  {post.createdBy === user.username ? "You" : post.createdBy}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

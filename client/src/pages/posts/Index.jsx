import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
  //   // creating a variable to represent if the post is owned by the user

  //   // variable to represent if the user has solved this post
  //
  console.log();
  return (
    <div className="flex flex-col justify-center ">
      <h1 className="text-center m-4">TRICK OR TWEET</h1>
      <button onClick={() => seed()}>Seed</button>
      {user.username ? (
        <button onClick={() => navigate("/posts/new")}>NEW POST</button>
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
              className=" flex m-4 flex-row"
            >
              {solved ? (
                <><div
                className={`flex flex-wrap items-center justify-center ${solved.correct ? `bg-green-500` : `bg-red-500`} w-20 h-20 rounded-full m-2 text-center`}
              >
                
              </div></>
              ) : (
                <>
                  <div
                    className={`flex flex-wrap items-center justify-center bg-slate-700 w-20 h-20 rounded-full m-2 text-center`}
                  >
                    <p className="min-w-0 break-words m-2">
                      {post.candyPoints}pts
                    </p>
                  </div>
                </>
              )}

              <div className="flex flex-col justify-between bg-slate-700 m-2 p-2 w-10/12 md:w-96">
                <p>{post.teaser}</p>
                {console.log(post.createdBy, user.username)}
                {/* display "You" instead of your username if it is your post */}
                <p className="text-right">
                  {post.createdBy === user.username ? "You" : post.createdBy}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

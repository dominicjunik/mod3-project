import axios from '../../api'
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Candy from "../../components/Candy";
import { UserCheck } from "react-feather";

export default function Index({ user }) {
  const [loaded, setLoaded] = useState(false)
  // this will store the posts from the DB to map onto the page
  const [posts, setPosts] = useState([]);
  // navigate for button routing
  const navigate = useNavigate();

  // this seeds the database with a fresh set of data
  async function seed() {
    try {
      await axios.post("/api/posts/seed");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  }

  // get posts from database
  async function getPosts() {
    try {
      // request all the posts from the database
      const response = await axios.get("/api/posts");
      console.log('this is the response.data from the server:')
      console.log(response.data);
      // save them in state
      setPosts(response.data);
    } catch (error) {
      console.log('error in getPosts()')
      console.log(error.message);
    }
    
    if(Array.isArray(posts)){setLoaded(true)}
  }
  // on page load make the database call
  useEffect(() => {
    getPosts();
  }, []);
console.log('this is the posts variable:')
  console.log(posts)
  // console.log(user);
  return (
    
    <div className="flex flex-col justify-center ">
      <h1 className="text-center m-4 mb-4 sm:mb-16 font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-br from-black to-yellow-800 font-outline-2">
        TRICK OR TWEET
      </h1>
      {/* <button onClick={()=>seed()}>seed</button> */}
      {user.username ? (
        <button
          onClick={() => navigate("/posts/new")}
          className="mx-7 p-3 rounded-2xl border-transparent border-2 hover:border-white  bg-black/90 hover:bg-black/80 hover:underline"
        >
          CREATE NEW POST
        </button>
      ) : <div className='mx-7 p-3 rounded-2xl border-transparent max-w-full md:max-w-lg border-2 flex justify-center items-center  bg-black/90 '>Welcome to a virtual Halloween experience. Every post is either a trick or a treat, guess correctly to win candy. Register/Login to start playing.</div>}
      <div className="">
        {loaded ? posts.map((post, i) => {
          // if the logged in user has solved this post save the data into this variable
          let solved = post.solvedBy.find(
            (peep) => peep.username === user.username
          );

          // console.log(solved);
          return (
            <Link
              key={i}
              to={`/posts/${post._id}`}
              className=" flex m-4 flex-row group"
            >
              {solved ? (
                <>
                  <div
                    className={`flex flex-wrap items-center justify-center border-2 break-words border-yellow-500 font-semibold group-hover:border-white ${
                      solved.correct
                        ? `bg-gradient-to-tl from-black to-green-500/90`
                        : `bg-gradient-to-tl from-black to-red-600/90`
                    } w-20 h-20 rounded-full m-2 text-center bg-black/90 `}
                  >
                    <p className="flex items-center min-w-0 break-words m-2 text-xl">
                      {/* conditional rendering to display if the user won or lost points on a post, no symbol for own posts */}
                      {post.createdBy !== user.username &&
                        (solved.correct ? "+" : "-")}
                      {post.candyPoints}
                      <Candy />
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={`flex flex-wrap items-center justify-center border-2 border-transparent group-hover:border-white group-hover:bg-black/80 bg-black/90 w-20 h-20 rounded-full m-2 text-center `}
                  >
                    <p className="flex items-center min-w-0 break-words m-2 text-xl">
                      {post.candyPoints}
                      <Candy />
                    </p>
                  </div>
                </>
              )}

              <div className="flex flex-col justify-between border-2 border-transparent group-hover:border-white bg-black/90 group-hover:bg-black/80 m-2 p-2 w-10/12 md:w-96  rounded-2xl">
                <p>{post.teaser}</p>
                {console.log(post.createdBy, user.username)}
                {/* display "You" instead of your username if it is your post */}
                <div className="flex justify-between">
                  <div className="flex">
                    {" "}
                    {post.solvedBy.length}
                    <UserCheck className="mx-2" />
                  </div>

                  {post.createdBy === user.username ? (
                    <span className="text-yellow-400">You</span>
                  ) : (
                    post.createdBy
                  )}
                </div>
              </div>
            </Link>
          );
        }): <div className='mx-7 p-3 rounded-2xl border-transparent border-2 flex justify-center items-center bg-black/90 '> <span className='animate-pulse'>The Database needs a few moments to wakeup</span></div>}
      </div>
    </div>
  );
}

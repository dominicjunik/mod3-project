import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Index({ username }) {
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

  return (
    <div className="flex flex-col justify-center">
      <h1 className="text-center m-4">TRICK OR TREAT</h1>
      <button onClick={() => seed()}>Seed</button>
      {username ? (
        <button onClick={() => navigate("/posts/new")}>NEW POST</button>
      ) : null}
      <div className="">
        {posts.map((post, i) => (
          
            <Link key={i} to={`/posts/${post._id}`} className=" flex m-4 flex-row">
            <div className="flex flex-wrap items-center justify-center bg-slate-700 w-20 h-20 rounded-full m-2 text-center">
              <p className="min-w-0 break-words m-2">{post.candyPoints}pts</p> 
            </div>
            
              <div className="bg-slate-700 m-2 p-2 w-10/12 md:w-96">
                <p>{post.teaser}</p>
                <p></p>
               
              </div>
            </Link>
        
        ))}
      </div>
    </div>
  );
}

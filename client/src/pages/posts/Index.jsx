import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index({ username }) {
  // this will store the posts from the DB to map onto the page
  const [posts, setPosts] = useState([]);
  // navigate for button routing
  const navigate = useNavigate();

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
      {username ? <button onClick={() => navigate('/posts/new')}>NEW POST</button> : null}
      <div>
        {posts.map((post, i) => (
          <div key={i} className="m-4 bg-slate-700 p-2">
            <a href={`/posts/${post._id}`} >
              <p>{post.teaser}</p>
              <p>{post.candyPoints}pts</p>
              <p>+{post.likes}</p>
              <p>-{post.dislikes}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

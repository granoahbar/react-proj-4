// importing react hooks from react
import { useState, useEffect, useContext } from "react";
// importing axios from axios
import axios from "axios";
// importing the auth context
import AuthContext from "../store/authContext";
// creating a component called home
const Home = () => {
  const { userId } = useContext(AuthContext);
  // setting a peice of state for posts that will run set posts when posts changes which will be in the for of an array
  const [posts, setPosts] = useState([]);
  // writing code to make a get request to this end point, then once you get the response...
  useEffect(() => {
    axios
      .get("/posts")
      .then((res) => {
        // if there is a user id, set the otherUsersPosts variable to the res data that has been filtered to make sure that only other users posts are displayed
        if (userId) {
          const otherUsersPosts = res.data.filter(
            (post) => userId !== post.userId
          );
          setPosts(otherUsersPosts);
        } else {
          setPosts(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);
  // mapping through the posts and returing html for each one
  const mappedPosts = posts.map((post) => {
    return (
      <div key={post.id} className="post-card">
        <h2>{post.title}</h2>
        <h4>{post.user.username}</h4>
        <p>{post.content}</p>
      </div>
    );
  });

  // If there are no posts, let the user know that, if there are put the mapped posts from above in

  return mappedPosts.length >= 1 ? (
    <main>{mappedPosts}</main>
  ) : (
    <main>
      <h1>There are no posts yet!</h1>
    </main>
  );
};

export default Home;

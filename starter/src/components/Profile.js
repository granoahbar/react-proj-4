// importing your react hooks
import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
// importing the AuthContext
import AuthContext from "../store/authContext";
// writing a component for displaying a profile
const Profile = () => {
  const { userId, token } = useContext(AuthContext);
  // creating state for displaying posts that will set posts which will be an array
  const [posts, setPosts] = useState([]);
  // creating a function for getting a users posts by making an http request using axios and the end poin that is outlined below.
  const getUserPosts = useCallback(() => {
    axios
      .get(`/userposts/${userId}`)
      // after the response comes back, setPosts to the value of the response data
      .then((res) => setPosts(res.data))
      // then we are going to be handling andy errors by sending them to the console so we can see
      .catch((err) => console.log(err));
  }, [userId]);
  // this is saying that we want to get the users posts every time
  useEffect(() => {
    getUserPosts();
  }, [getUserPosts]);
  // functionality for updating a post that takes in an id and status
  const updatePost = (id, status) => {
    // writing a put request at the end point defined below
    axios
      .put(
        `/posts/${id}`,
        // this is saying that the staus is a boolean, true or not true for private or not
        { status: !status },
        {
          headers: {
            authorization: token,
          },
        }
      )
      //   then we are re running the function to get the users posts again
      .then(() => {
        getUserPosts();
      })
      // error handling by sending the errors to the console to be read
      .catch((err) => {
        console.log(err);
      });
  };
  // creating functionlity for deleting a post
  // making a delete request to the following end point and taking in an id
  const deletePost = (id) => {
    axios
      .delete(`/posts/${id}`, {
        headers: {
          authorization: token,
        },
      })
      // getting the users posts again after that
      .then(() => {
        getUserPosts();
      })
      // cathing any errors and sending them to the console to be seen
      .catch((err) => {
        console.log(err);
      });
  };

  // mapping over all the posts and returning some JSX code with the posts data for each post
  const mappedPosts = posts.map((post) => {
    return (
      <div key={post.id} className="post-card">
        <h2>{post.title}</h2>
        <h4>{post.user.username}</h4>
        <p>{post.content}</p>
        {userId === post.userId && (
          <div>
            <button
              className="form-btn"
              onClick={() => updatePost(post.id, post.privateStatus)}
            >
              {post.privateStatus ? "make public" : "make private"}
            </button>
            <button
              className="form-btn"
              style={{ marginLeft: 10 }}
              onClick={() => deletePost(post.id)}
            >
              delete post
            </button>
          </div>
        )}
      </div>
    );
  });
  // if there are not any posts then you are diaplying this html instead that is telling the user that they are not displaying anything yet.
  return mappedPosts.length >= 1 ? (
    <main>{mappedPosts}</main>
  ) : (
    <main>
      <h1>You haven't posted yet!</h1>
    </main>
  );
};

export default Profile;

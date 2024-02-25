import React, { useEffect, useState } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

const Single = () => {
  const [posts, setPosts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const username = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${username}`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [username]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="posts-container" style={{ textAlign: "center" }}>
      <h1>Profile</h1>
      {posts.length > 0 ? (
        posts.map((post, index) => (
          index % 3 === 0 && (
            <div key={`row_${index}`} className="post-row">
              {posts.slice(index, index + 3).map((post) => (
                <div key={post.id} className="post" style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "20px" }}>
                  <div className="content" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div>
                      <h2 style={{ marginBottom: "15px" }}>{post.username}</h2>
                    </div>
                    <img src={`../upload/${post.img}`} alt="" style={{ width: "400px", height: "350px", marginBottom: "10px" }} />
                    <div style={{ marginBottom: "10px" }}>
                      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.description) }}></p>
                    </div>
                    {currentUser.username === post.username && (
                      <div className="edit" style={{ marginBottom: "10px" }}>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                      </div>
                    )}
                    <div>
                      <p>Posted {moment(post.date).fromNow()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ))
      ) : (
        <div>
          <h4 style={{textAlign:"center", padding:"50px"}}>NO POSTS</h4>
        </div>
      )}
    </div>
  );

  
};

export default Single;
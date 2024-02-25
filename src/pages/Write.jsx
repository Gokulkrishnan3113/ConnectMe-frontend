import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation} from "react-router-dom";
import moment from "moment";

const Write = ({closeModal}) => {
  const state = useLocation().state;
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      state
        ? await axios.put(`/posts/${state.id}`, {
            desc: value,
            img: file ? imgUrl : "",
          })
        : await axios.post(`/posts/`, {
            desc: value,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          });
      window.location.reload();
      closeModal();
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add" style={{ padding: "20px" }}>
      <h1 className="content" style={{ marginBottom: "20px" }}>Add Posts</h1>
      <div className="content" style={{ marginBottom: "20px" }}>
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div>
        <input
          style={{ display: "none" }}
          type="file"
          id="file"
          name=""
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label className="file" htmlFor="file" style={{ cursor: "pointer" }}>
          Upload Image
        </label>
        <button
          style={{
            padding: "10px 20px",
            margin: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default Write;

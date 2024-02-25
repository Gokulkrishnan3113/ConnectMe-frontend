import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";
import Modal from "react-modal";
import Write from "../pages/Write";
import axios from "axios"; // Import Axios

Modal.setAppElement("#root");

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    try {
      const response = await axios.get(`/search?query=${query}`); // Use Axios
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/" style={{ cursor: "pointer" }}>
          <h1 className="pacifico-regular" style={{ fontFamily: "Pacifico", fontWeight: 800, fontStyle: "normal", fontSize: "25px", textDecoration: "none", color: "#b9e7e7" }}>ConnectMe</h1>

          </Link>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="search-results" style={searchResults.length > 0 ? { display: 'block' } : { display: 'none' }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {searchResults.map(result => (
              <li key={result.id} style={{textAlign:"center"}}>
                <Link to={`/profile/${result.username}`} style={{ textDecoration: "none", color: "inherit", fontSize:"14px", textAlign:"center"}}>
                  {result.username}
                </Link>
              </li>
            ))}
          </ul>

          </div>
        </div>
        <div className="links">
          <Link
            to={`/profile/${currentUser?.username}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <span>{currentUser?.username}</span>
          </Link>
          {currentUser ? (
            <span onClick={logout}>Logout</span>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
          <span className="write">
          <button className="link" onClick={openModal} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", textDecoration: "none" }}>
            Write
          </button>

          </span>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Write Modal"
        style={{
          content: {
            width: "40%",
            height: "40%",
            margin: "auto",
            padding: "20px", 
            borderRadius: "8px",
            overflow: "auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "#555",
            textDecorationColor:"red"
          }}
          onClick={closeModal}
        >
          x
        </button>{" "}
        <Write closeModal={closeModal} />
      </Modal>
    </div>
  );
};

export default Navbar;

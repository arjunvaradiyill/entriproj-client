import React, { useState } from "react";
import Header from "../components/Header.jsx"
import "../styles/Home.css";

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleExploreClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="home">
      {/* Explore Movies Section */}
      <section className="explore-movies">
        <h2>Explore Movies</h2>
        <div className="movies-grid">
          {/* Movie Cards */}
          <div className="movie-card">
            <img src="https://i.pinimg.com/474x/a4/c0/a6/a4c0a6635375973e23a688b85f01e597.jpg" alt="Movie 1" />
            <h3>Kishkindha Kandam</h3>
            <p>⭐ 4.5/5</p>
            <p className="movie-description">
              A mythological adventure based on the legendary tales of Kishkindha.
            </p>
          </div>

          <div className="movie-card">
            <img src="https://i.pinimg.com/736x/e2/bf/2e/e2bf2e80a043c8e82b415a2101f7058b.jpg" alt="Movie 2" />
            <h3>Kalki</h3>
            <p>⭐ 4.2/5</p>
            <p className="movie-description">
              A thrilling story of a powerful warrior on a mission to restore justice.
            </p>
          </div>

          <div className="movie-card">
            <img src="https://i.pinimg.com/474x/a3/a8/72/a3a872bedc6afe040e29f54cd19dc967.jpg" alt="Movie 3" />
            <h3>Vikram</h3>
            <p>⭐ 4.7/5</p>
            <p className="movie-description">
              An intense action-packed thriller following an undercover operation.
            </p>
          </div>

          <div className="movie-card">
            <img src="https://i.pinimg.com/474x/64/65/d8/6465d8f562072ee6fe7ea6dce06cea4d.jpg" alt="Movie 4" />
            <h3>Jailer</h3>
            <p>⭐ 4.6/5</p>
            <p className="movie-description">
              A gripping tale of a retired jailer who is forced back into action.
            </p>
          </div>

          <div className="movie-card">
            <img src="https://i.pinimg.com/474x/e7/db/c9/e7dbc965a736451f30eb3f105d173f29.jpg" alt="Movie 5" />
            <h3>Ponniyin Selvan</h3>
            <p>⭐ 4.8/5</p>
            <p className="movie-description">
              A historical epic based on the Chola dynasty's rise and fall.
            </p>
          </div>

        </div>

        {/* Explore Button */}
        <button className="explore-btn" onClick={handleExploreClick}>
          Explore More
        </button>

        {/* Popup Component */}
        {showPopup && <AuthPopup onClose={handleClosePopup} />}
      </section>
    </div>
  );
};

const AuthPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Login or Sign Up</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Login</button>
          <button>Sign Up</button>
        </form>
        <button className="close-btn" onClick={onClose}>
          ❌ Close
        </button>
      </div>
    </div>
  );
};

export default Home;

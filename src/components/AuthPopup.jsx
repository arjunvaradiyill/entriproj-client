import React from "react";
import "../styles/AuthPopup.css";

const AuthPopup = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Login or Sign Up</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <div className="popup-buttons">
            <button type="submit" className="login-btn">Login</button>
            <button className="signup-btn">Sign Up</button>
          </div>
        </form>
        <button className="close-btn" onClick={onClose}>❌ Close</button>
      </div>
    </div>
  );
};

export default AuthPopup;

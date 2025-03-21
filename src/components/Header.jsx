import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ onLoginClick }) => {
    return (
        <header className="header">
            <div className="logo">
                <Link to="/IFDB">IFDB</Link> {/* IFDB Title on the left */}
            </div>
            <nav className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <button className="login-btn" onClick={onLoginClick}>Login</button>
            </nav>
        </header>
    );
};

export default Header;

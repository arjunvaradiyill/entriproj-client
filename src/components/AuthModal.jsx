import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState(""); // 🔹 Added Name field for Signup
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const url = isLogin ? "http://localhost:8000/api/users/login" : "http://localhost:8000/api/users/register";
        const payload = isLogin
            ? { email, password }
            : { name, email, password }; // 🔹 Include name in signup request

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || (isLogin ? "Login failed" : "Signup failed"));
            }

            setSuccess(isLogin ? "Login successful! Redirecting..." : "Signup successful! Please log in.");
            localStorage.setItem("user", JSON.stringify(data.user));

            setTimeout(() => {
                if (isLogin) {
                    navigate("/IFDB"); // 🔹 Redirects to IFDB page after login
                } else {
                    setIsLogin(true); // Switch to login after signup
                }
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return isOpen ? (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={onClose}>X</button>
                <h2>{isLogin ? "Login" : "Sign Up"}</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <form onSubmit={handleSubmit}>
                    {!isLogin && ( // 🔹 Show Name field only for Signup
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" disabled={loading}>{loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}</button>
                </form>
                <p className="toggle-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <span onClick={toggleForm}>{isLogin ? "Sign Up" : "Login"}</span>
                </p>
            </div>
        </div>
    ) : null;
};

export default AuthModal;

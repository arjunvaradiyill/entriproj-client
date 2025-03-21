import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import IFDB from "./pages/IFDB";
import Dashboard from "./pages/Dashboard";
import AuthModal from "./components/AuthModal";
import MovieList from "./pages/MovieList"; // Relative import
import UserProvider from "./context/UserProvider.jsx"; // ✅ Ensure correct import

function App() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <UserProvider> {/* ✅ Wrap everything inside UserProvider */}
            <Router>
                <Header onLoginClick={() => setModalOpen(true)} />
                <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/IFDB" element={<IFDB />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/movies" element={<MovieList />} /> {/* Add MovieList Route */}
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;

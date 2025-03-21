import { logoutUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/login"); // Redirect to login after logout
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;

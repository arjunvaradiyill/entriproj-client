import { useEffect, useState } from "react";
import API from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/users/profile")
      .then((res) => setUser(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>User Profile</h2>
      {user ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => API.post("/users/logout").then(() => window.location.reload())}>
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;

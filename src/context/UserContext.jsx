import React, { createContext, useState } from "react";

export const UserContext = createContext(null); // ✅ Default value to avoid destructuring error

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;

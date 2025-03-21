export const signup = async (name, email, password) => {
    try {
        const response = await fetch("http://localhost:8000/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Signup failed");
        }

        return data; // Returns { message, user: { _id, name, email } }
    } catch (error) {
        console.error("Signup Error:", error.message);
        return { error: error.message };
    }
};

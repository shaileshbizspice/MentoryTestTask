import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();  // Hook to navigate programmatically

  useEffect(() => {
    async function fetchUser() {
      try {
        await axios.get("/sanctum/csrf-cookie"); // Ensure CSRF token is set
        const response = await axios.get("/api/user");
        setUser(response.data); // Set user data
      } catch (err) {
        setUser(null); // Handle failed authentication
        navigate('/login'); // Redirect to login if user is not authenticated
      }
    }
    fetchUser();
  }, [navigate]); // Add navigate as a dependency

  const logout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      setUser(null); // Clear user state on logout
      navigate('/login'); // Redirect to login after logout
      window.location.reload(); // Optionally reload the page to reset UI
    } catch (err) {
      console.log("Logout failed", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

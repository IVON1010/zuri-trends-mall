import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        toast.error('User not found!')
      } else {
        const userData = await response.json();
        console.log("Logged in user:", userData);
        setLoggedInUser(userData); 
        localStorage.setItem("loggedInUser", JSON.stringify(userData)); 
        navigate("/");

        toast.success(`${userData.name} successfully logged in!`);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null); 
    localStorage.removeItem("loggedInUser"); 
    setEmail(""); 
    setPassword("");
    setName("");
    toast.success("Successfully logged out!");
  };

  return (
    <div className="login-page">
      {loggedInUser ? (
        <div>
          <h2>Already logged in as {loggedInUser.name}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;

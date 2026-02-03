import React, { useState } from "react";
import "./App.css";
import googlelogo from "./assets/google.png";
import { useNavigate } from "react-router-dom";
import { login, signup } from "./services/authService";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // ⭐ LOGIN
        const data = await login({ username, password });

        // ⭐ SAVE EVERYTHING
        localStorage.setItem("cineverse_token", data.token);
        localStorage.setItem("cineverse_role", data.role);
        localStorage.setItem("cineverse_userId", data.userId);
        localStorage.setItem("cineverse_username", data.username);

        // ⭐ ROUTING (CORRECT CHECK)
        if (data.role === "ADMIN" || data.role === "SUPER_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // ⭐ SIGNUP
        await signup({
          username,
          password,
          role: "USER",
          phone,
          city,
          state,
        });
        setIsLogin(true);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="tabs">
          <button
            className={`loginbtn switch-btn ${isLogin ? "active-tab" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={`loginbtn switch-btn ${!isLogin ? "active-tab" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <h2 className="title-text">
          {isLogin ? "Welcome Back" : "Join CineVerse"}
        </h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="input-box"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input-box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Phone Number"
                className="input-box"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="City"
                className="input-box"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="State"
                className="input-box"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </>
          )}

          <button className="loginbtn main-btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {isLogin && (
          <button className="loginbtn google-btn" type="button">
            <img src={googlelogo} alt="Google Logo" className="google-icon" />
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import './App.css'
import googlelogo from './assets/google.png'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="tabs">
           <button
            className={`loginbtn switch-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`loginbtn switch-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <p className="small-text">
          {isLogin ? "Please enter your details" : "Create your account"}
        </p>

        <h2 className="title-text">
          {isLogin ? "Welcome back" : "Join CineVerse"}
        </h2>

        {!isLogin && (
          <input type="text" placeholder="Full name" className="input-box" />
        )}

        <input type="email" placeholder="Email address" className="input-box" />

        <input
          type="password"
          placeholder="Password"
          className="input-box"
        />

        {isLogin && (
          <div className="options-row">
            <label className="remember">
              <input type="checkbox" /> Remember for 30 days
            </label>

            <button className="link-btn">Forgot password?</button>
          </div>
        )}

        <button className=" loginbtn main-btn">
          {isLogin ? "Sign in" : "Create account"}
        </button>

        {isLogin && (
          <button className="loginbtn google-btn">
          <img src={googlelogo} alt="Google Logo" className="google-icon" />
          Sign in with Google
          </button>

        )}

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="switch-link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}
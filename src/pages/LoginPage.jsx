import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "../api/auth";
import { useAuth } from "../auth/AuthContext.jsx";

import "./LoginPage.css";

export default function LoginPage() {
  // Step 1 - Email only
  // Step 2 - Password input
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { refreshMe } = useAuth(); 

  function handleEmailSubmit(e) {
    e.preventDefault();

    const normalized = email.trim().toLowerCase();
    if (!normalized) return;

    setEmail(normalized);
    setStep(2);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Please enter email and password");
      return;
    }

    // Wired to backend, navigate ready
    try {
      setLoading(true);
      await authApi.login(normalizedEmail, password);
      await refreshMe();
      navigate("/home", {replace: true});
    } catch (err) {
      setError(err.message || "Login Failed");
    } finally {
      setLoading(false);
    }

  }

  const titleText = step === 1 ? "Unlimited horror movies, TV shows, and nightmares" : "Enter your info to sign in"
  const bodyText = step === 1 ? "Ready to have a sleepless night? Enter your email and save your favorite horror for later." : "Or get started with a new account."

  return (
    <main className={`login-page ${step === 2 ? "login-page--step2" : ""}`}>

      <section className="login-card">

        <h1 className="login-title">{titleText}</h1> 

        <p className="login-body">{bodyText}</p>

        {error ? <p className="login-error">{error}</p> : null }

        {step === 1 ? (
         
         <form className="login-row" onSubmit={handleEmailSubmit}>
           
            <input
              className="login-input"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button className="login-button" type="submit">
           
              Get Started
          
            </button>
         
          </form>
        
      ) : (

        <form className="login-stack" onSubmit={handleLoginSubmit}>
          
          <input
            className="login-input"
            type="email"
            placeholder="Enter your email address"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setPassword("");
            }}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-button" type="submit" disabled={loading}>

              {loading ? "Logging in..." : "Log in"}

          </button>

          <div className="login-secondary">

            <span>New here?</span> <Link to="/register">Create an Account</Link>

          </div>

        </form>

      )}

      </section>

    </main>

  );
  
}
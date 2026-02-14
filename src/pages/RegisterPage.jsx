import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "../api/auth";
import { useAuth } from "../auth/AuthContext.jsx";

import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { refreshMe } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedUsername || !normalizedEmail || !password || !confirmPassword) {
      setError("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Create Account
      await authApi.register(normalizedUsername, normalizedEmail, password);

      // Log in right away
      await authApi.login(normalizedEmail, password);

      // Sync AuthContext (authorization)
      await refreshMe();

      // Load App
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  }

  const titleText = "Create your account";
  const bodyText = "You're almost there";

  return (
    <main className="register-page">

      <section className="register-card">

        <h1 className="register-title">{titleText}</h1>
        <p className="register-body">{bodyText}</p>

        {error ? <p className="register-error">{error}</p> : null}

        <form onSubmit={handleSubmit} className="register-form">

          <label className="register-label">
            Username
            <input
              className="register-input"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="register-label">
            Email
            <input
              className="register-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="register-label">
            Password
            <input
              className="register-input"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label className="register-label">
            Repeat Password
            <input
              className="register-input"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          <button className="register-button" type="submit" disabled={loading}>

            {loading ? "Creating account..." : "Create account"}

          </button>

        </form>

        <p className="register-secondary">

          Already have an account? <Link to="/login">Log in</Link>

        </p>

      </section>

    </main>

  );

}
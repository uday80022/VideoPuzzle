import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Designs/LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Returnmessage, setReturnmessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const userData = {
      username,
      password,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setReturnmessage(data.message);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) {
      setReturnmessage(message);
    }
  }, []);

  return (
    <div className="loginPageContainer">
      <h2 className="loginPageTitle">Login</h2>
      <form className="loginPageForm" onSubmit={handleLogin}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="loginPageInputField"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="loginPageInputField"
            required
          />
        </div>
        <p className="centeredText">
          <span
            className="forgotPasswordLink"
            onClick={() => navigate("/passwordreset")}
          >
            Forgot your password?
          </span>
        </p>
        {Returnmessage && (
          <p className="loginPageErrorMessage">{Returnmessage}</p>
        )}
        <button type="submit" className="loginPageSubmitButton">
          Login
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <span className="registerLink" onClick={() => navigate("/register")}>
          Register
        </span>
      </p>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import "../Designs/LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [returnmessage, setreturnmessage] = useState("");

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
        setreturnmessage(data.message);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

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
        {returnmessage && (
          <p className="loginPageErrorMessage">{returnmessage}</p>
        )}
        <button type="submit" className="loginPageSubmitButton">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

import React, { useState } from "react";
import "../Designs/ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !newPassword) {
      setResetMessage("Email and password are required.");
      return;
    }

    const formData = {
      email: email,
      new_password: newPassword,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/password_reset/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResetMessage(data.message);
      } else {
        console.error("Failed to reset password");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="resetPasswordPageContainer">
      <h1 className="resetPasswordPageTitle">Reset Password</h1>
      <form className="resetPasswordPageForm">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="resetPasswordPageInputField"
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="resetPasswordPageInputField"
          />
        </div>
        <button
          onClick={handleResetPassword}
          className="resetPasswordPageSubmitButton"
        >
          Reset Password
        </button>

        {resetMessage && (
          <p className="resetPasswordPageMessage">{resetMessage}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPasswordPage;

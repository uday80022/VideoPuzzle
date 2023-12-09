import React from "react";
import { useNavigate } from "react-router-dom";

const LoginRequired = () => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <p>Please log in to access this page.</p>
      <button onClick={redirectToLogin}>Go to Login</button>
    </div>
  );
};

export default LoginRequired;

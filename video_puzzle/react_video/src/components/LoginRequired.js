import React from "react";
import { useNavigate } from "react-router-dom";

const LoginRequired = () => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <p>Please login or register</p>
      <button onClick={redirectToLogin}>Go to Login</button>
    </div>
  );
};

export default LoginRequired;

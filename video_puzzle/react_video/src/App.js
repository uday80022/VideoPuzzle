import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import LoginRequired from "./components/LoginRequired";
import HomePage from "./components/HomePage";
import ResetPasswordPage from "./components/ResetPasswordPage ";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loginrequired" element={<LoginRequired />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/passwordreset" element={<ResetPasswordPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

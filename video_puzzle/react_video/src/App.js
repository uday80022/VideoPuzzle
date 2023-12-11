import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import LoginRequired from "./components/LoginRequired";
import HomePage from "./components/HomePage";
import ResetPasswordPage from "./components/ResetPasswordPage ";
import Navigationbar from "./components/Navigationbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const showNavbar = !["/register", "/login", "/"].includes(location.pathname);

  return (
    <div className="App">
      {showNavbar && <Navigationbar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/loginrequired" element={<Layout><LoginRequired /></Layout>} />
        <Route path="/home" element={<Layout><HomePage /></Layout>} />
        <Route path="/passwordreset" element={<Layout><ResetPasswordPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

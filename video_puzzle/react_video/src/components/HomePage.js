import React, { useState, useEffect } from "react";
import LoginRequired from "./LoginRequired";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      setIsAuthenticated(true);
    };

    checkAuthentication();
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Welcome to the Home Page!</h2>
        </div>
      ) : (
        <LoginRequired />
      )}
    </div>
  );
};

export default HomePage;

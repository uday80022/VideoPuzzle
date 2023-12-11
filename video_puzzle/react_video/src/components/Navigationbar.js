import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logout from "../icons/logout.svg";
import Axios from "axios";

function Navigationbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios.post(
        "http://127.0.0.1:8000/api/user_logout/"
      );
      if (response.data.message === "success") {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="/">
            <h2>Video-Puzzle</h2>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/home"
                className={location.pathname === "/home" ? "active" : ""}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/home"
                className={location.pathname === "/puzzle" ? "active" : ""}
              >
                Puzzle
              </Nav.Link>
              <NavDropdown title="User" id="basic-nav-dropdown">
                <NavDropdown.Item
                  as={Link}
                  to="/passwordreset"
                  className={
                    location.pathname === "/password-recovery" ? "active" : ""
                  }
                >
                  Password Recovery
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={Link}
                  to="/home"
                  className={
                    location.pathname === "/account_settings" ? "active" : ""
                  }
                >
                  Account Settings
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link
                as={Link}
                to="/home"
                className={
                  location.pathname === "/subscription" ? "active" : ""
                }
              >
                Subscription
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/home"
                className={location.pathname === "/about" ? "active" : ""}
              >
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="icons" style={{ justifyContent: "end" }}>
            <Nav style={{ gap: "0.5rem", alignItems: "center" }}>
              <Nav.Link as={Link} to="/" onClick={handleLogout}>
                <img src={logout} alt="logout"></img>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Navigationbar;

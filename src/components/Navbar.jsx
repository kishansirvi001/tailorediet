import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="navbar-logo">
        <NavLink to="/">TailorDiet</NavLink>
      </div>

      {/* Menu */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

        <li>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
        </li>

        <li>
          <NavLink to="/calculator" onClick={() => setMenuOpen(false)}>
            Calculator
          </NavLink>
        </li>

        <li>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
        </li>

        {/* If NOT logged in */}
        {!token && (
          <>
            <li>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
            </li>

            <li>
              <NavLink to="/signup" onClick={() => setMenuOpen(false)}>
                Signup
              </NavLink>
            </li>
          </>
        )}

        {/* If logged in */}
        {token && (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}

      </ul>

      {/* Hamburger */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

    </nav>
   
  );
}

export default Navbar;
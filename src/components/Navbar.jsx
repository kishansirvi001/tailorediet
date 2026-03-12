import React, { useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="navbar-logo">
        <NavLink to="/">TailorDiet</NavLink>
      </div>

      {/* Menu */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

        <li>
          <NavLink 
            to="/" 
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Home
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/about"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            About
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/calculator"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Calculator
          </NavLink>
        </li>

        <li>
          <NavLink 
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Contact
          </NavLink>
        </li>

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
import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Logo + About */}
        <div className="footer-col">
          <h2 className="footer-logo">TailorDiet</h2>
          <p>
            Personalized diet plans and smart health tools to help you stay fit
            and achieve your goals easily.
          </p>
        </div>

        {/* Links */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/calculator">Calculator</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Features */}
        <div className="footer-col">
          <h3>Features</h3>
          <ul>
            <li><a href="#">BMI Calculator</a></li>
            <li><a href="#">Diet Plans</a></li>
            <li><a href="#">Nutrition Tips</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h3>Contact</h3>
          <p>Email: support@tailordiet.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} TailorDiet. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;
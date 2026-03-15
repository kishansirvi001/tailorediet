import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Components */
import Navbar from "./components/Navbar";

/* Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Calculator from "./pages/Calculator";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

/* Global styles */
import "./App.css";

/* Component styles */
import "./components/Navbar.css";
import "./components/Hero.css";
import "./components/Features.css";
import "./components/Testimonials.css";
import "./components/Questionnaire.css";
import "./components/CTA.css";

/* Page styles */
import "./pages/Home.css";
import "./pages/About.css";
import "./pages/Calculator.css";
import "./pages/Contact.css";

function App() {
  return (
    <Router>
      <div className="App">

        {/* Navbar always visible */}
        <Navbar />

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

        </Routes>

      </div>
    </Router>
  );
}

export default App;
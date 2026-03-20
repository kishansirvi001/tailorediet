import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Global styles */
import "./App.css";

/* Components */
import Navbar from "./components/Navbar"; // ✅ Navbar import
import Questionnaire from "./components/Questionnaire";
import Footer from "./components/footer";

/* Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Calculator from "./pages/Calculator";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

/* Component styles */
import "./components/Features.css";
import "./components/Testimonials.css";
import "./components/Questionnaire.css";

/* Page styles */
import "./pages/Home.css";
import "./pages/About.css";
import "./pages/Calculator.css";
import "./pages/Contact.css";

function App() {
  return (
    <Router>
      <div className="App">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>

        {/* ✅ ADD THIS */}
        <Footer />

      </div>
    </Router>
  );
}
export default App;
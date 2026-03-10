import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator.jsx"; // Must match the path
import About from "./pages/About";
import "./App.css";
import { useState } from "react";

function App() {
  return (
    <Router>

      <div className="app">

        <Navbar />

        <div className="page-container">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/about" element={<About />} />
          </Routes>

        </div>

      </div>

    </Router>
  );
}

export default App;
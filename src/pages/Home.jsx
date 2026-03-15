import { useState } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Questionnaire from "../components/Questionnaire";
import CTA from "../components/CTA";

import "./Home.css";

function Home() {

  const [start, setStart] = useState(false);

  const handleStart = () => {
    setStart(true);
  };

  return (
    <div className="home">

      {!start ? (
        <>
          <Hero start={handleStart} />

          <Features />

          <Testimonials />

          <CTA start={handleStart} />
        </>
      ) : (
        <Questionnaire />
      )}

    </div>
  );
}

export default Home;

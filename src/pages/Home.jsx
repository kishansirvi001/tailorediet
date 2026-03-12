import { useState } from "react";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Questionnaire from "../components/Questionnaire";
import CTA from "../components/CTA";

import "./Home.css";

function Home() {

  const [start, setStart] = useState(false);

  return (
    <div className="home">

      {!start && (
        <>
          <Hero start={() => setStart(true)} />

          <Features />

          <Testimonials />

          <CTA start={() => setStart(true)} />
        </>
      )}

      {start && (
        <Questionnaire />
      )}

    </div>
  );
}

export default Home;
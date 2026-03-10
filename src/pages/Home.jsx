import { useState } from "react";
import Hero from "../components/Hero";
import Questionnaire from "../components/Questionnaire";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";

function Home() {
  const [start, setStart] = useState(false);

  return (
    <div className="page-container">
      {!start && (
        <>
          <Hero start={() => setStart(true)} />
          <HowItWorks />
          <Features />
          <Testimonials />
          <CTA start={() => setStart(true)} />
        </>
      )}

      {start && <Questionnaire />}
    </div>
  );
}

export default Home;
import { useState } from "react";
import "./Questionnaire.css";

function Questionnaire() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activity: "",
    diet: ""
  });

  const [plan, setPlan] = useState("");

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const generatePlan = async () => {
    try {
      const res = await fetch("http://localhost:5000/diet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setPlan(data.plan);
      setStep(5);
    } catch (err) {
      setPlan("Error generating plan");
      setStep(5);
    }
  };

  return (
    <div className="q-container">

      {/* Progress */}
      <div className="progress">
        Step {step} of 5
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="card">
          <h2>Basic Info</h2>

          <input
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={(e) => handleChange("age", e.target.value)}
          />

          <select onChange={(e) => handleChange("gender", e.target.value)}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <button onClick={next}>Next</button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="card">
          <h2>Body Details</h2>

          <input
            placeholder="Height (cm)"
            type="number"
            value={form.height}
            onChange={(e) => handleChange("height", e.target.value)}
          />

          <input
            placeholder="Weight (kg)"
            type="number"
            value={form.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
          />

          <div className="btns">
            <button onClick={back}>Back</button>
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="card">
          <h2>Your Goal</h2>

          <select onChange={(e) => handleChange("goal", e.target.value)}>
            <option value="">Select Goal</option>
            <option value="loss">Weight Loss</option>
            <option value="gain">Muscle Gain</option>
            <option value="maintain">Maintain</option>
          </select>

          <select onChange={(e) => handleChange("activity", e.target.value)}>
            <option value="">Activity Level</option>
            <option>Sedentary</option>
            <option>Light</option>
            <option>Moderate</option>
            <option>Active</option>
          </select>

          <div className="btns">
            <button onClick={back}>Back</button>
            <button onClick={next}>Next</button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className="card">
          <h2>Diet Preference</h2>

          <select onChange={(e) => handleChange("diet", e.target.value)}>
            <option value="">Select Diet</option>
            <option>Vegetarian</option>
            <option>Non-Vegetarian</option>
            <option>Vegan</option>
            <option>Keto</option>
          </select>

          <div className="btns">
            <button onClick={back}>Back</button>
            <button onClick={generatePlan}>Generate Plan</button>
          </div>
        </div>
      )}

      {/* STEP 5 RESULT */}
      {step === 5 && (
        <div className="card result">
          <h2>Your Indian Diet Plan 🇮🇳</h2>

          {plan ? (
            <div className="plan">
              {plan.split("\n").map((item, i) => (
                <div key={i} className="plan-card">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p>Generating...</p>
          )}
        </div>
      )}

    </div>
  );
}

export default Questionnaire; 
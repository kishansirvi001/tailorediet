import React, { useState } from "react";
import "./Calculator.css";

function Calculator() {
  /* Common States */
  const [weight, setWeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [activity, setActivity] = useState("");

  /* Results */
  const [bmi, setBmi] = useState("");
  const [bmiMessage, setBmiMessage] = useState("");
  const [calories, setCalories] = useState("");
  const [bmrResult, setBmrResult] = useState("");
  const [idealWeight, setIdealWeight] = useState("");

  /* Convert Height to CM */
  const getHeightCm = () => {
    return (feet * 30.48) + (inches * 2.54);
  };

  /* ========================
     BMI Calculation
  ======================== */
  const calcBMI = () => {
    if (!weight || !feet) return;

    const heightCm = getHeightCm();
    const h = heightCm / 100;

    const bmiValue = weight / (h * h);
    setBmi(bmiValue.toFixed(2));

    // Calculate healthy weight range
    const minWeight = 18.5 * h * h;
    const maxWeight = 24.9 * h * h;

    let message = "";
    if (bmiValue < 18.5) {
      message = `You are underweight. You can gain approx ${(minWeight - weight).toFixed(1)} kg to reach a healthy weight.`;
    } else if (bmiValue > 24.9) {
      message = `You are overweight. You can lose approx ${(weight - maxWeight).toFixed(1)} kg to reach a healthy weight.`;
    } else {
      message = "Your weight is within a healthy range.";
    }
    setBmiMessage(message);
  };

  /* ========================
     Calorie (TDEE) Calculation
  ======================== */
  const calcCalories = () => {
    if (!weight || !age || !gender || !activity || !feet) return;

    const heightCm = getHeightCm();
    let bmr;

    if (gender === "male") {
      bmr = 10 * weight + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * heightCm - 5 * age - 161;
    }

    const tdee = bmr * parseFloat(activity);
    setCalories(Math.round(tdee));
  };

  /* ========================
     BMR Calculation
  ======================== */
  const calcBMR = () => {
    if (!weight || !age || !gender || !feet) return;

    const heightCm = getHeightCm();
    let bmr;

    if (gender === "male") {
      bmr = 10 * weight + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * heightCm - 5 * age - 161;
    }

    setBmrResult(Math.round(bmr));
  };

  /* ========================
     Ideal Weight Calculation
  ======================== */
  const calcIdealWeight = () => {
    if (!gender || !feet) return;

    const heightCm = getHeightCm();
    const heightInches = heightCm / 2.54;

    let result;
    if (gender === "male") {
      result = 50 + 2.3 * (heightInches - 60);
    } else {
      result = 45.5 + 2.3 * (heightInches - 60);
    }

    setIdealWeight(result.toFixed(1));
  };

  return (
    <div className="calculator-page">

      {/* ========================
         BMI Calculator
      ======================== */}
      <div className="calculator-card">
        <h1>BMI Calculator</h1>
        <p className="calc-desc">
          Body Mass Index (BMI) helps determine if your weight is healthy relative to your height.
        </p>

        <input type="number" placeholder="Weight (kg)" onChange={(e) => setWeight(e.target.value)} />
        <input type="number" placeholder="Height (feet)" onChange={(e) => setFeet(e.target.value)} />
        <input type="number" placeholder="Height (inches)" onChange={(e) => setInches(e.target.value)} />

        <button onClick={calcBMI}>Calculate BMI</button>

        {bmi && (
          <div className="bmi-result">
            <h2>Your BMI: {bmi}</h2>
            <p>{bmiMessage}</p>
          </div>
        )}
      </div>

      {/* ========================
         Calorie Calculator
      ======================== */}
      <div className="calculator-card">
        <h1>Calorie Calculator</h1>
        <p className="calc-desc">
          Estimate how many calories you need daily based on your age, weight, height, gender, and activity level.
        </p>

        <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
        <input type="number" placeholder="Weight (kg)" onChange={(e) => setWeight(e.target.value)} />
        <input type="number" placeholder="Height (feet)" onChange={(e) => setFeet(e.target.value)} />
        <input type="number" placeholder="Height (inches)" onChange={(e) => setInches(e.target.value)} />

        <select onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select onChange={(e) => setActivity(e.target.value)}>
          <option value="">Activity Level</option>
          <option value="1.2">Sedentary (little exercise)</option>
          <option value="1.375">Light exercise (1-3 days/week)</option>
          <option value="1.55">Moderate exercise (3-5 days/week)</option>
          <option value="1.725">Heavy exercise (6-7 days/week)</option>
          <option value="1.9">Athlete</option>
        </select>

        <button onClick={calcCalories}>Calculate Calories</button>

        {calories && (
          <div className="bmi-result">
            <h2>Daily Calories Needed: {calories} kcal</h2>
          </div>
        )}
      </div>

      {/* ========================
         BMR Calculator
      ======================== */}
      <div className="calculator-card">
        <h1>BMR Calculator</h1>
        <p className="calc-desc">
          Basal Metabolic Rate (BMR) is the number of calories your body burns at rest to maintain vital functions.
        </p>

        <input type="number" placeholder="Age" onChange={(e) => setAge(e.target.value)} />
        <input type="number" placeholder="Weight (kg)" onChange={(e) => setWeight(e.target.value)} />
        <input type="number" placeholder="Height (feet)" onChange={(e) => setFeet(e.target.value)} />
        <input type="number" placeholder="Height (inches)" onChange={(e) => setInches(e.target.value)} />

        <select onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button onClick={calcBMR}>Calculate BMR</button>

        {bmrResult && (
          <div className="bmi-result">
            <h2>Your BMR: {bmrResult} kcal/day</h2>
          </div>
        )}
      </div>

      {/* ========================
         Ideal Weight Calculator
      ======================== */}
      <div className="calculator-card">
        <h1>Ideal Weight Calculator</h1>
        <p className="calc-desc">
          Calculate a healthy weight range based on your height and gender using the Devine formula.
        </p>

        <input type="number" placeholder="Height (feet)" onChange={(e) => setFeet(e.target.value)} />
        <input type="number" placeholder="Height (inches)" onChange={(e) => setInches(e.target.value)} />

        <select onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <button onClick={calcIdealWeight}>Calculate Ideal Weight</button>

        {idealWeight && (
          <div className="bmi-result">
            <h2>Ideal Weight: {idealWeight} kg</h2>
          </div>
        )}
      </div>

    </div>
  );
}

export default Calculator;
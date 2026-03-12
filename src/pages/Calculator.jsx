import React, { useState } from "react";

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
  const [calories, setCalories] = useState("");
  const [bmrResult, setBmrResult] = useState("");
  const [idealWeight, setIdealWeight] = useState("");

  /* Convert Height to CM */
  const getHeightCm = () => {
    return (feet * 30.48) + (inches * 2.54);
  };

  /* BMI Calculation */
  const calcBMI = () => {

    if (!weight || !feet) return;

    const heightCm = getHeightCm();
    const h = heightCm / 100;

    const bmiValue = weight / (h * h);

    setBmi(bmiValue.toFixed(2));
  };

  /* Calorie Calculation (TDEE) */
  const calcCalories = () => {

    if (!weight || !age || !gender || !activity || !feet) return;

    const heightCm = getHeightCm();

    let bmr;

    if (gender === "male") {
      bmr = 10 * weight + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * heightCm - 5 * age - 161;
    }

    const tdee = bmr * activity;

    setCalories(Math.round(tdee));
  };

  /* BMR Calculation */
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

  /* Ideal Weight */
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

      {/* BMI */}
      <div className="calculator-card">
        <h1>BMI Calculator</h1>
        <p className="calc-desc">
          Quickly check if your weight is in a healthy range.
        </p>

        <input
          type="number"
          placeholder="Weight (kg)"
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (feet)"
          onChange={(e) => setFeet(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (inches)"
          onChange={(e) => setInches(e.target.value)}
        />

        <button onClick={calcBMI}>Calculate BMI</button>

        {bmi && (
          <div className="bmi-result">
            <h2>Your BMI: {bmi}</h2>
          </div>
        )}
      </div>

      {/* Calories */}
      <div className="calculator-card">
        <h1>Calorie Calculator</h1>
        <p className="calc-desc">
          Find how many calories your body needs each day based on your lifestyle.
        </p>

        <input
          type="number"
          placeholder="Age"
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (feet)"
          onChange={(e) => setFeet(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (inches)"
          onChange={(e) => setInches(e.target.value)}
        />

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

      {/* BMR */}
      <div className="calculator-card">
        <h1>BMR Calculator</h1>
        <p className="calc-desc">
          See how many calories your body burns at rest.
        </p>

        <input
          type="number"
          placeholder="Age"
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (feet)"
          onChange={(e) => setFeet(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (inches)"
          onChange={(e) => setInches(e.target.value)}
        />

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

      {/* Ideal Weight */}
      <div className="calculator-card">
        <h1>Ideal Weight Calculator</h1>
        <p className="calc-desc">
          Estimate a healthy weight range for your height.
        </p>

        <input
          type="number"
          placeholder="Height (feet)"
          onChange={(e) => setFeet(e.target.value)}
        />

        <input
          type="number"
          placeholder="Height (inches)"
          onChange={(e) => setInches(e.target.value)}
        />

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
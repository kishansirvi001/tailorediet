import { activityOptions, goalOptions } from './calculatorData.js'

function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function kgToLb(kg) {
  return (toNumber(kg) * 2.20462).toFixed(1)
}

export function lbToKg(lb) {
  return toNumber(lb) / 2.20462
}

export function cmToFeetInches(cm) {
  const totalInches = toNumber(cm) / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches - feet * 12)
  if (inches === 12) {
    return { feet: feet + 1, inches: 0 }
  }
  return { feet, inches }
}

export function feetInchesToCm(feet, inches) {
  return (toNumber(feet) * 12 + toNumber(inches)) * 2.54
}

export function getActivityOption(value) {
  return activityOptions.find((option) => option.value === value) ?? activityOptions[2]
}

export function getGoalOption(value) {
  return goalOptions.find((option) => option.value === value) ?? goalOptions[1]
}

export function calculateCalories({ age, weight, height, activity, goal }) {
  const activityOption = getActivityOption(activity)
  const goalOption = getGoalOption(goal)
  const normalizedAge = toNumber(age)
  const normalizedWeight = toNumber(weight)
  const normalizedHeight = toNumber(height)
  const bmr = 10 * normalizedWeight + 6.25 * normalizedHeight - 5 * normalizedAge + 5
  const maintenance = Math.max(1200, Math.round(bmr * activityOption.multiplier))
  const target = Math.max(1400, maintenance + goalOption.calorieOffset)

  return {
    maintenance,
    target,
    range: `${Math.max(1200, target - 120)} to ${target + 120} kcal`,
    activityLabel: activityOption.label,
    goalLabel: goalOption.label,
    goalDirection: goalOption.direction,
    goalPace: goalOption.pace,
  }
}

export function calculateCalorieDeficit({ age, weight, height, activity, deficit = 450 }) {
  const base = calculateCalories({ age, weight, height, activity, goal: 'maintain' })
  const normalizedDeficit = Math.max(100, Math.min(1000, toNumber(deficit)))
  const target = Math.max(1200, base.maintenance - normalizedDeficit)

  return {
    maintenance: base.maintenance,
    deficit: normalizedDeficit,
    target,
    weeklyChange: `${(normalizedDeficit * 7 / 7700).toFixed(2)} kg / week`,
    range: `${Math.max(1200, target - 100)} to ${target + 100} kcal`,
  }
}

export function calculateCalorieSurplus({ age, weight, height, activity, surplus = 280 }) {
  const base = calculateCalories({ age, weight, height, activity, goal: 'maintain' })
  const normalizedSurplus = Math.max(100, Math.min(1000, toNumber(surplus)))
  const target = base.maintenance + normalizedSurplus

  return {
    maintenance: base.maintenance,
    surplus: normalizedSurplus,
    target,
    weeklyChange: `${(normalizedSurplus * 7 / 7700).toFixed(2)} kg / week`,
    range: `${Math.max(1400, target - 100)} to ${target + 100} kcal`,
  }
}

export function calculateBmi({ weight, height }) {
  const normalizedWeight = toNumber(weight)
  const normalizedHeight = Math.max(1, toNumber(height))
  const bmi = normalizedWeight / ((normalizedHeight / 100) * (normalizedHeight / 100))

  let label = 'Healthy range'
  if (bmi < 18.5) label = 'Underweight range'
  else if (bmi >= 25 && bmi < 30) label = 'Overweight range'
  else if (bmi >= 30) label = 'Higher-risk range'

  return {
    bmi: bmi.toFixed(1),
    label,
    note: 'BMI is a general screening tool and should be used alongside other health indicators.',
  }
}

export function calculateMacros({ calories, proteinRatio, carbsRatio, fatsRatio }) {
  const normalizedCalories = toNumber(calories)
  const normalizedProteinRatio = toNumber(proteinRatio)
  const normalizedCarbsRatio = toNumber(carbsRatio)
  const normalizedFatsRatio = toNumber(fatsRatio)

  return {
    protein: Math.round((normalizedCalories * normalizedProteinRatio) / 100 / 4),
    carbs: Math.round((normalizedCalories * normalizedCarbsRatio) / 100 / 4),
    fats: Math.round((normalizedCalories * normalizedFatsRatio) / 100 / 9),
    totalRatio: normalizedProteinRatio + normalizedCarbsRatio + normalizedFatsRatio,
  }
}

export function validateBodyMetrics({ age, weight, height }) {
  const issues = []
  const normalizedAge = toNumber(age)
  const normalizedWeight = toNumber(weight)
  const normalizedHeight = toNumber(height)

  if (normalizedAge && (normalizedAge < 15 || normalizedAge > 90)) {
    issues.push('Age should be between 15 and 90 for this calculator.')
  }
  if (normalizedWeight < 35 || normalizedWeight > 300) {
    issues.push('Weight should be between 35 kg and 300 kg.')
  }
  if (normalizedHeight < 130 || normalizedHeight > 230) {
    issues.push('Height should be between 130 cm and 230 cm.')
  }

  return issues
}

export function validateMacroInputs({ calories, proteinRatio, carbsRatio, fatsRatio }) {
  const issues = []
  const normalizedCalories = toNumber(calories)
  const normalizedProteinRatio = toNumber(proteinRatio)
  const normalizedCarbsRatio = toNumber(carbsRatio)
  const normalizedFatsRatio = toNumber(fatsRatio)
  const totalRatio = normalizedProteinRatio + normalizedCarbsRatio + normalizedFatsRatio

  if (normalizedCalories < 1000 || normalizedCalories > 6000) {
    issues.push('Calories should be between 1000 and 6000.')
  }
  if (normalizedProteinRatio < 0 || normalizedCarbsRatio < 0 || normalizedFatsRatio < 0) {
    issues.push('Macro ratios cannot be negative.')
  }
  if (totalRatio !== 100) {
    issues.push('Protein, carbs, and fats must add up to exactly 100%.')
  }

  return issues
}

export function calculateWaterIntake({ weight, activity }) {
  const normalizedWeight = toNumber(weight)
  const activityOption = getActivityOption(activity)
  const baseMl = normalizedWeight * 35
  const activityBonusLiters =
    activityOption.value === 'sedentary'
      ? 0
      : activityOption.value === 'light'
        ? 0.35
        : activityOption.value === 'moderate'
          ? 0.7
          : activityOption.value === 'active'
            ? 1
            : 1.25
  const liters = baseMl / 1000 + activityBonusLiters

  return {
    liters: liters.toFixed(1),
    glasses: Math.round(liters * 4.2),
    note: `${activityOption.label} activity adds hydration demand.`,
  }
}

export function calculateIdealWeight({ height }) {
  const normalizedHeight = Math.max(1, toNumber(height))
  const meters = normalizedHeight / 100
  const target = 22 * meters * meters
  const lower = 18.5 * meters * meters
  const upper = 24.9 * meters * meters

  return {
    target: `${target.toFixed(1)} kg`,
    range: `${lower.toFixed(1)} to ${upper.toFixed(1)} kg`,
    note: 'Based on a healthy BMI reference band and midpoint.',
  }
}

export function calculateBodyFatEstimate({ age, weight, height, sex }) {
  const bmiInfo = calculateBmi({ weight, height })
  const bmi = toNumber(bmiInfo.bmi)
  const normalizedAge = toNumber(age)
  const sexFactor = sex === 'male' ? 1 : 0
  const estimate = 1.2 * bmi + 0.23 * normalizedAge - 10.8 * sexFactor - 5.4

  return {
    percent: `${Math.max(3, estimate).toFixed(1)}%`,
    note: 'This is a screening estimate, not a clinical body composition reading.',
  }
}

export function calculateBMR({ age, weight, height, sex }) {
  const normalizedAge = toNumber(age)
  const normalizedWeight = toNumber(weight)
  const normalizedHeight = toNumber(height)
  
  let bmr
  if (sex === 'male') {
    bmr = 88.362 + 13.397 * normalizedWeight + 4.799 * normalizedHeight - 5.677 * normalizedAge
  } else {
    bmr = 447.593 + 9.247 * normalizedWeight + 3.098 * normalizedHeight - 4.330 * normalizedAge
  }

  return {
    bmr: Math.max(1000, Math.round(bmr)),
    note: 'Basal Metabolic Rate (BMR) is the minimum calories needed at rest.',
  }
}

export function calculateTDEE({ age, weight, height, activity, sex }) {
  const bmrResult = calculateBMR({ age, weight, height, sex })
  const activityOption = getActivityOption(activity)
  const tdee = Math.round(bmrResult.bmr * activityOption.multiplier)

  return {
    bmr: bmrResult.bmr,
    tdee,
    activityLevel: activityOption.label,
    note: 'Total Daily Energy Expenditure (TDEE) is calories burned in a day.',
  }
}

export function calculateMetabolicAge({ age, weight, height, sex }) {
  const bmiInfo = calculateBmi({ weight, height })
  const bmi = toNumber(bmiInfo.bmi)
  const normalizedAge = toNumber(age)
  
  const avgBmi = sex === 'male' ? 22.5 : 21.5
  const metabolicAge = normalizedAge + (bmi - avgBmi) * 0.75

  return {
    age: Math.max(15, Math.round(metabolicAge)),
    actual: normalizedAge,
    difference: Math.round(metabolicAge - normalizedAge),
    note: 'Metabolic age compares your BMI to people of the same biological age.',
  }
}

export function calculateExerciseCalories({ weight, duration, exerciseType }) {
  const normalizedWeight = toNumber(weight)
  const normalizedDuration = toNumber(duration)
  
  const metFactors = {
    'walking': 3.5,
    'jogging': 7,
    'running': 9.8,
    'cycling': 7.5,
    'swimming': 8,
    'hiit': 10,
    'yoga': 3,
    'strength': 6,
  }
  
  const met = metFactors[exerciseType] || 5
  const caloriesBurned = Math.round((met * normalizedWeight * normalizedDuration) / 60)

  return {
    calories: Math.max(0, caloriesBurned),
    met,
    note: `${exerciseType} burns approximately ${caloriesBurned} calories.`,
  }
}

export function calculateStepCalories({ weight, steps, height }) {
  const normalizedWeight = toNumber(weight)
  const normalizedSteps = toNumber(steps)
  const normalizedHeight = toNumber(height)
  
  const strideLength = (normalizedHeight * 0.413) / 100
  const distanceKm = (normalizedSteps * strideLength) / 1000
  const caloriesPerKm = normalizedWeight * 1.036
  const calories = Math.round(distanceKm * caloriesPerKm)

  return {
    calories: Math.max(0, calories),
    steps: normalizedSteps,
    distanceKm: distanceKm.toFixed(2),
    note: 'Based on body weight and stride length.',
  }
}

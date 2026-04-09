import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AccountPage from './pages/AccountPage.jsx'
import HomePage from './pages/HomePage.jsx'
import BmiCalculatorPage from './pages/BmiCalculatorPage.jsx'
import BodyFatCalculatorPage from './pages/BodyFatCalculatorPage.jsx'
import CalorieCalculatorPage from './pages/CalorieCalculatorPage.jsx'
import CalorieDeficitCalculatorPage from './pages/CalorieDeficitCalculatorPage.jsx'
import CalorieSurplusCalculatorPage from './pages/CalorieSurplusCalculatorPage.jsx'
import DietPlansPage from './pages/DietPlansPage.jsx'
import GoalPlannerPage from './pages/GoalPlannerPage.jsx'
import HealthCalculatorsPage from './pages/HealthCalculatorsPage.jsx'
import IdealWeightCalculatorPage from './pages/IdealWeightCalculatorPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MacroCalculatorPage from './pages/MacroCalculatorPage.jsx'
import MealScannerPage from './pages/MealScannerPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import WaterIntakeCalculatorPage from './pages/WaterIntakeCalculatorPage.jsx'

function RouterApp() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/calculators" element={<HealthCalculatorsPage />} />
      <Route path="/calculators/calorie" element={<CalorieCalculatorPage />} />
      <Route path="/calculators/calorie-deficit" element={<CalorieDeficitCalculatorPage />} />
      <Route path="/calculators/calorie-surplus" element={<CalorieSurplusCalculatorPage />} />
      <Route path="/calculators/bmi" element={<BmiCalculatorPage />} />
      <Route path="/calculators/body-fat" element={<BodyFatCalculatorPage />} />
      <Route path="/calculators/ideal-weight" element={<IdealWeightCalculatorPage />} />
      <Route path="/calculators/macro" element={<MacroCalculatorPage />} />
      <Route path="/workout-planner" element={<GoalPlannerPage />} />
      <Route path="/calculators/goal" element={<Navigate to="/workout-planner" replace />} />
      <Route path="/calculators/water-intake" element={<WaterIntakeCalculatorPage />} />
      <Route path="/diet-plans" element={<DietPlansPage />} />
      <Route
        path="/meal-scanner"
        element={
          <ProtectedRoute>
            <MealScannerPage />
          </ProtectedRoute>
        }
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default RouterApp

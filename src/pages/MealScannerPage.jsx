import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteShell from '../components/SiteShell.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { scanMealPhoto } from '../services/mealScanApi.js'

function scaleNutrition(nutritionPer100g, grams) {
  const multiplier = Number(grams || 0) / 100

  return {
    calories: Math.round((nutritionPer100g.calories || 0) * multiplier * 10) / 10,
    protein: Math.round((nutritionPer100g.protein || 0) * multiplier * 10) / 10,
    carbs: Math.round((nutritionPer100g.carbs || 0) * multiplier * 10) / 10,
    fat: Math.round((nutritionPer100g.fat || 0) * multiplier * 10) / 10,
  }
}

function MealScannerPage() {
  const { token, user } = useAuth()
  const [imagePreview, setImagePreview] = useState('')
  const [imageBase64, setImageBase64] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [confirmedWeight, setConfirmedWeight] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleFileChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result || '')
      setImagePreview(result)
      setImageBase64(result)
      setAnalysis(null)
      setConfirmedWeight('')
      setErrorMessage('')
    }

    reader.onerror = () => {
      setErrorMessage('Could not read that image. Please try another one.')
    }

    reader.readAsDataURL(file)
  }

  async function handleScan(event) {
    event.preventDefault()

    if (!imageBase64) {
      setErrorMessage('Upload a meal photo first.')
      return
    }

    setIsScanning(true)
    setErrorMessage('')

    try {
      const nextAnalysis = await scanMealPhoto({ token, imageBase64 })
      setAnalysis(nextAnalysis)
      setConfirmedWeight(String(nextAnalysis.estimatedPortion.estimatedWeightGrams))
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsScanning(false)
    }
  }

  const finalNutrition = useMemo(() => {
    if (!analysis) {
      return null
    }

    const grams = Number(confirmedWeight || analysis.estimatedPortion.estimatedWeightGrams)
    return scaleNutrition(analysis.nutritionPer100g, grams)
  }, [analysis, confirmedWeight])

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
        <div className="rounded-[2rem] border border-stone-900/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,239,227,0.92))] p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
            Protected tool
          </p>
          <h1 className="mt-4 font-['Georgia'] text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Scan a meal photo and tighten the nutrition estimate with your quantity.
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
            Upload a meal image, let AI estimate the dish and portion, then confirm how much food the photo actually contains so calories, protein, carbs, and fat are more believable.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[1.5rem] border border-white/70 bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">How it works</p>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                The AI estimates the meal and nutrition per 100 g. You confirm the visible quantity in grams, and the final total updates immediately.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-emerald-200/70 bg-emerald-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Signed-in access</p>
              <p className="mt-3 text-sm leading-6 text-emerald-900">
                This scanner is available only for logged-in users. You are scanning as {user?.name || 'a TailorDiet member'}.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/account"
              className="rounded-full border border-stone-300 bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-stone-900 transition hover:border-stone-500 hover:bg-stone-50"
            >
              Back to account
            </Link>
            <Link
              to="/diet-plans"
              className="rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_35px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5"
            >
              View diet plans
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-900/10 bg-white/85 p-6 shadow-[0_30px_70px_rgba(28,25,23,0.1)] backdrop-blur sm:p-8">
          <form className="space-y-5" onSubmit={handleScan}>
            <label className="block rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50/80 p-5 transition hover:border-amber-300">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                Upload meal photo
              </span>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="mt-4 block w-full text-sm text-stone-700" />
            </label>

            {imagePreview ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-stone-200 bg-stone-50">
                <img src={imagePreview} alt="Meal preview" className="h-72 w-full object-cover" />
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isScanning}
              className="w-full rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_35px_rgba(249,115,22,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isScanning ? 'Scanning meal...' : 'Scan meal photo'}
            </button>
          </form>

          {analysis ? (
            <div className="mt-8 space-y-5">
              <div className="rounded-[1.5rem] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(251,248,240,0.9))] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      AI meal estimate
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-stone-950">{analysis.mealName}</h2>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-900">
                    Confidence: {analysis.confidence}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-stone-700">{analysis.summary}</p>
                {analysis.visibleItems.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.visibleItems.map((item) => (
                      <span key={item} className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-700">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="rounded-[1.5rem] border border-amber-200/70 bg-amber-50/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800/80">
                  Quantity confirmation
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  AI guessed: {analysis.estimatedPortion.quantityLabel}. Adjust the actual quantity in grams for a better final estimate.
                </p>
                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    Actual quantity in photo or eaten (grams)
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={confirmedWeight}
                    onChange={(event) => setConfirmedWeight(event.target.value)}
                    className="w-full rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-950 focus:border-amber-400 focus:outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-stone-900 p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-400">Calories</p>
                  <p className="mt-2 text-3xl font-semibold">{finalNutrition?.calories ?? 0}</p>
                </div>
                <div className="rounded-2xl bg-emerald-200 p-5 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Protein</p>
                  <p className="mt-2 text-3xl font-semibold">{finalNutrition?.protein ?? 0} g</p>
                </div>
                <div className="rounded-2xl bg-sky-200 p-5 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Carbs</p>
                  <p className="mt-2 text-3xl font-semibold">{finalNutrition?.carbs ?? 0} g</p>
                </div>
                <div className="rounded-2xl bg-rose-200 p-5 text-stone-950">
                  <p className="text-xs uppercase tracking-[0.16em] text-stone-700">Fat</p>
                  <p className="mt-2 text-3xl font-semibold">{finalNutrition?.fat ?? 0} g</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-stone-200 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Nutrition density
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-700">
                  Per 100 g: {analysis.nutritionPer100g.calories} kcal, {analysis.nutritionPer100g.protein} g protein, {analysis.nutritionPer100g.carbs} g carbs, {analysis.nutritionPer100g.fat} g fat.
                </p>
              </div>

              {analysis.accuracyTips.length ? (
                <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    Accuracy tips
                  </p>
                  <div className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                    {analysis.accuracyTips.map((tip) => (
                      <p key={tip}>{tip}</p>
                    ))}
                  </div>
                </div>
              ) : null}

              <p className="text-xs leading-6 text-stone-500">{analysis.disclaimer}</p>
            </div>
          ) : null}
        </div>
      </section>
    </SiteShell>
  )
}

export default MealScannerPage

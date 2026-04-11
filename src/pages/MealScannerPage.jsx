import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [streamActive, setStreamActive] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [imageBase64, setImageBase64] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [confirmedWeight, setConfirmedWeight] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    // enumerate devices so user can pick camera
    async function loadDevices() {
      try {
        const list = await navigator.mediaDevices.enumerateDevices()
        const videoInput = list.filter((d) => d.kind === 'videoinput')
        setDevices(videoInput)
        if (videoInput.length && !selectedDeviceId) {
          setSelectedDeviceId(videoInput[0].deviceId)
        }
      } catch (e) {
        console.debug('enumerateDevices failed', e)
      }
    }
    loadDevices()
  }, [])

  useEffect(() => {
    // cleanup on unmount
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setErrorMessage('Please upload an image file.')
    try {
      const data = await fileToDataUrl(file)
      setImagePreview(data)
      setImageBase64(data)
      setAnalysis(null)
      setConfirmedWeight('')
      setErrorMessage('')
      stopCamera()
    } catch (err) {
      setErrorMessage('Could not read that image.')
    }
  }

  async function startCamera(deviceId) {
    stopCamera()
    try {
      const constraints = deviceId
        ? { video: { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } }
        : { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.muted = true
        try {
          await videoRef.current.play()
        } catch (e) {
          // ignore
        }
        if (videoRef.current.readyState < 2) {
          await new Promise((resolve) => videoRef.current.addEventListener('loadedmetadata', resolve, { once: true }))
        }
      }
      setStreamActive(true)
      setErrorMessage('')
    } catch (err) {
      console.error(err)
      setErrorMessage('Unable to start camera. Check permissions or try another device/browser.')
      stopCamera()
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setStreamActive(false)
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const ctx = canvas.getContext('2d')
    const w = video.videoWidth || 1280
    const h = video.videoHeight || Math.round((w * 9) / 16)
    canvas.width = w
    canvas.height = h
    ctx.drawImage(video, 0, 0, w, h)
    const data = canvas.toDataURL('image/jpeg', 0.9)
    setImagePreview(data)
    setImageBase64(data)
    setAnalysis(null)
    setConfirmedWeight('')
    setErrorMessage('')
    stopCamera()
  }

  async function handleScan(e) {
    e.preventDefault()
    if (!imageBase64) return setErrorMessage('Please upload or capture a photo first.')
    setIsScanning(true)
    setErrorMessage('')
    try {
      const result = await scanMealPhoto({ token, imageBase64 })
      setAnalysis(result)
      setConfirmedWeight(String(result.estimatedPortion?.estimatedWeightGrams || ''))
    } catch (err) {
      setErrorMessage(err.message || 'Meal scan failed')
    } finally {
      setIsScanning(false)
    }
  }

  const finalNutrition = useMemo(() => {
    if (!analysis) return null
    const grams = Number(confirmedWeight || analysis.estimatedPortion?.estimatedWeightGrams)
    return scaleNutrition(analysis.nutritionPer100g || {}, grams)
  }, [analysis, confirmedWeight])

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-16">
        <div className="rounded-[2rem] border border-stone-900/10 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">Meal scanner</p>
          <h1 className="mt-4 font-['Georgia'] text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">Capture or upload a meal photo</h1>
          <p className="mt-3 text-sm leading-6 text-stone-700">Use your camera or upload an image. The scanner will estimate the dish and nutrition; confirm the visible quantity to improve accuracy.</p>

          <div className="mt-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Upload photo</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="mt-3 block w-full text-sm text-stone-700" />
              </label>

              <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Camera</span>
                    <p className="mt-1 text-sm text-stone-600">Select a camera and start live preview.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={selectedDeviceId} onChange={(e) => setSelectedDeviceId(e.target.value)} className="rounded-md bg-white border px-3 py-2 text-sm">
                      {devices.map((d) => (
                        <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(-4)}`}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => startCamera(selectedDeviceId)} className="rounded-md bg-amber-500 text-white px-3 py-2 text-sm">Start</button>
                    <button type="button" onClick={stopCamera} className="rounded-md border px-3 py-2 text-sm">Stop</button>
                  </div>
                </div>
              </div>
            </div>

            {streamActive && (
              <div>
                <video ref={videoRef} autoPlay playsInline muted className="h-64 w-full rounded-[1rem] bg-stone-100 object-cover border" />
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={capturePhoto} className="rounded-full bg-amber-500 text-white px-4 py-2 text-sm">Capture</button>
                </div>
              </div>
            )}
            /* Hidden canvas for captures */
            <canvas ref={canvasRef} className="hidden" />

            {!streamActive && !imagePreview && (
              <div className="mt-4 flex h-64 w-full items-center justify-center rounded-[1rem] border border-dashed border-stone-200 bg-gradient-to-br from-stone-50 to-white">
                <div className="text-center text-sm text-stone-500">
                  <p className="mb-2 font-medium">No photo yet</p>
                  <p className="mb-3">Upload an image or start the camera to capture a meal.</p>
                </div>
              </div>
            )}
            {imagePreview && (
              <div className="overflow-hidden rounded-[1rem] border mt-4">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover bg-stone-100" />
              </div>
            )}
            {errorMessage && <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{errorMessage}</div>}
            <form onSubmit={handleScan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Estimated quantity (grams)</label>
                <input type="number" min="1" value={confirmedWeight} onChange={(e) => setConfirmedWeight(e.target.value)} className="w-full rounded-md border px-3 py-2 mt-2" />
              </div>
              <button type="submit" disabled={isScanning} className="w-full rounded-full bg-amber-500 text-white px-4 py-3 text-sm">{isScanning ? 'Scanning…' : 'Scan photo'}</button>
            </form>
            {analysis && (
              <div className="mt-6 space-y-4">
              <div className="text-sm text-stone-500">Tip: for best results, place the plate on a plain background and take the photo from above.</div>
                <div className="rounded-md p-4 border bg-white">
                  <h3 className="text-lg font-semibold">{analysis.mealName}</h3>
                  <div className="text-sm text-stone-500 mt-1">(confidence {analysis.confidence})</div>
                  <p className="text-sm text-stone-700 mt-2">{analysis.summary}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-md p-3 bg-amber-50">
                    <div className="text-xs text-stone-500">Calories</div>
                    <div className="text-xl font-semibold">{finalNutrition?.calories ?? 0}</div>
                  </div>
                  <div className="rounded-md p-3 bg-amber-50">
                    <div className="text-xs text-stone-500">Protein</div>
                    <div className="text-xl font-semibold">{finalNutrition?.protein ?? 0} g</div>
                  </div>
                  <div className="rounded-md p-3 bg-amber-50">
                    <div className="text-xs text-stone-500">Carbs</div>
                    <div className="text-xl font-semibold">{finalNutrition?.carbs ?? 0} g</div>
                  </div>
                  <div className="rounded-md p-3 bg-amber-50">
                    <div className="text-xs text-stone-500">Fat</div>
                    <div className="text-xl font-semibold">{finalNutrition?.fat ?? 0} g</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default MealScannerPage

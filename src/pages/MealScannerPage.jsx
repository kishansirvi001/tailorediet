import { useEffect, useMemo, useRef, useState } from 'react'
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
  const { token } = useAuth()
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [streamActive, setStreamActive] = useState(false)
  const [isCameraStarting, setIsCameraStarting] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [imageBase64, setImageBase64] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [confirmedWeight, setConfirmedWeight] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  async function loadDevices() {
    if (!navigator.mediaDevices?.enumerateDevices) {
      return
    }

    try {
      const list = await navigator.mediaDevices.enumerateDevices()
      const videoInputs = list.filter((device) => device.kind === 'videoinput')
      setDevices(videoInputs)

      if (!selectedDeviceId && videoInputs.length > 0) {
        setSelectedDeviceId(videoInputs[0].deviceId)
      }
    } catch (error) {
      console.debug('enumerateDevices failed', error)
    }
  }

  useEffect(() => {
    loadDevices()
  }, [])

  useEffect(() => {
    if (!streamActive || !videoRef.current || !streamRef.current) {
      return
    }

    const video = videoRef.current
    video.srcObject = streamRef.current
    video.muted = true

    async function startPlayback() {
      try {
        await video.play()
      } catch (error) {
        console.debug('video play failed', error)
      }
    }

    startPlayback()

    return () => {
      if (video.srcObject) {
        video.srcObject = null
      }
    }
  }, [streamActive])

  useEffect(() => {
    return () => stopCamera()
  }, [])

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result || ''))
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file.')
      return
    }

    try {
      const data = await fileToDataUrl(file)
      setImagePreview(data)
      setImageBase64(data)
      setAnalysis(null)
      setConfirmedWeight('')
      setErrorMessage('')
      stopCamera()
    } catch {
      setErrorMessage('Could not read that image.')
    }
  }

  async function startCamera(deviceId) {
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Camera access is not supported in this browser.')
      return
    }

    setIsCameraStarting(true)
    setErrorMessage('')
    setAnalysis(null)
    setConfirmedWeight('')

    stopCamera()

    try {
      const constraints = deviceId
        ? {
            video: {
              deviceId: { exact: deviceId },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          }
        : {
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      setStreamActive(true)
      await loadDevices()
    } catch (error) {
      console.error(error)
      setErrorMessage('Unable to start camera. Allow camera permission and try again.')
      stopCamera()
    } finally {
      setIsCameraStarting(false)
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    setStreamActive(false)
    setIsCameraStarting(false)
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || video.readyState < 2) {
      setErrorMessage('Camera preview is not ready yet. Please wait a moment and try again.')
      return
    }

    const context = canvas.getContext('2d')
    const width = video.videoWidth || 1280
    const height = video.videoHeight || Math.round((width * 9) / 16)

    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)

    const data = canvas.toDataURL('image/jpeg', 0.9)
    setImagePreview(data)
    setImageBase64(data)
    setAnalysis(null)
    setConfirmedWeight('')
    setErrorMessage('')
    stopCamera()
  }

  async function handleScan(event) {
    event.preventDefault()

    if (!imageBase64) {
      setErrorMessage('Please upload or capture a photo first.')
      return
    }

    setIsScanning(true)
    setErrorMessage('')

    try {
      const result = await scanMealPhoto({ token, imageBase64 })
      setAnalysis(result)
      setConfirmedWeight(String(result.estimatedPortion?.estimatedWeightGrams || ''))
    } catch (error) {
      setErrorMessage(error.message || 'Meal scan failed.')
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
          <h1 className="mt-4 font-['Georgia'] text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
            Capture or upload a meal photo
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Start the camera for a live preview or upload a photo. Once the image looks right, scan it to estimate the dish and nutrition.
          </p>

          <div className="mt-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Upload photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="mt-3 block w-full text-sm text-stone-700"
                />
              </label>

              <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 p-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Camera</span>
                <p className="mt-1 text-sm text-stone-600">Choose a camera and open the live preview before capturing.</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <select
                    value={selectedDeviceId}
                    onChange={(event) => setSelectedDeviceId(event.target.value)}
                    className="min-w-0 flex-1 rounded-md border bg-white px-3 py-2 text-sm"
                  >
                    {devices.length === 0 ? (
                      <option value="">Default camera</option>
                    ) : (
                      devices.map((device, index) => (
                        <option key={device.deviceId || index} value={device.deviceId}>
                          {device.label || `Camera ${index + 1}`}
                        </option>
                      ))
                    )}
                  </select>
                  <button
                    type="button"
                    onClick={() => startCamera(selectedDeviceId)}
                    disabled={isCameraStarting}
                    className="rounded-md bg-amber-500 px-3 py-2 text-sm text-white disabled:opacity-70"
                  >
                    {isCameraStarting ? 'Starting...' : 'Start camera'}
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    disabled={!streamActive && !isCameraStarting}
                    className="rounded-md border px-3 py-2 text-sm disabled:opacity-60"
                  >
                    Stop
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1rem] border bg-stone-100">
              <div className="relative flex h-72 w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.18),transparent_45%),linear-gradient(135deg,#fafaf9,#f5f5f4)]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${streamActive ? 'block' : 'hidden'}`}
                />

                {!streamActive && imagePreview ? (
                  <img src={imagePreview} alt="Meal preview" className="h-full w-full object-cover" />
                ) : null}

                {!streamActive && !imagePreview ? (
                  <div className="px-6 text-center text-sm text-stone-500">
                    <p className="mb-2 font-medium">No photo yet</p>
                    <p>Start the camera to see a live preview, or upload a meal image.</p>
                  </div>
                ) : null}
              </div>
            </div>

            {streamActive ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm text-white"
                >
                  Capture photo
                </button>
              </div>
            ) : null}

            <canvas ref={canvasRef} className="hidden" />

            {errorMessage ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleScan} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Estimated quantity (grams)
                </label>
                <input
                  type="number"
                  min="1"
                  value={confirmedWeight}
                  onChange={(event) => setConfirmedWeight(event.target.value)}
                  className="mt-2 w-full rounded-md border px-3 py-2"
                />
              </div>
              <button
                type="submit"
                disabled={isScanning || !imageBase64}
                className="w-full rounded-full bg-amber-500 px-4 py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isScanning ? 'Scanning...' : 'Scan photo'}
              </button>
            </form>

            {analysis ? (
              <div className="mt-6 space-y-4">
                <div className="text-sm text-stone-500">
                  Tip: for best results, place the plate on a plain background and take the photo from above.
                </div>
                <div className="rounded-md border bg-white p-4">
                  <h3 className="text-lg font-semibold">{analysis.mealName}</h3>
                  <div className="mt-1 text-sm text-stone-500">Confidence: {analysis.confidence}</div>
                  <p className="mt-2 text-sm text-stone-700">{analysis.summary}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-amber-50 p-3">
                    <div className="text-xs text-stone-500">Calories</div>
                    <div className="text-xl font-semibold">{finalNutrition?.calories ?? 0}</div>
                  </div>
                  <div className="rounded-md bg-amber-50 p-3">
                    <div className="text-xs text-stone-500">Protein</div>
                    <div className="text-xl font-semibold">{finalNutrition?.protein ?? 0} g</div>
                  </div>
                  <div className="rounded-md bg-amber-50 p-3">
                    <div className="text-xs text-stone-500">Carbs</div>
                    <div className="text-xl font-semibold">{finalNutrition?.carbs ?? 0} g</div>
                  </div>
                  <div className="rounded-md bg-amber-50 p-3">
                    <div className="text-xs text-stone-500">Fat</div>
                    <div className="text-xl font-semibold">{finalNutrition?.fat ?? 0} g</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}

export default MealScannerPage

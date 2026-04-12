import { useEffect, useMemo, useRef, useState } from 'react'
import SiteShell from '../components/SiteShell.jsx'
import { fetchYouTubeShorts } from '../services/youtubeApi.js'

const FEED_VIEWPORT_CLASS = 'h-[calc(100vh-73px)] sm:h-[calc(100vh-77px)]'

const exerciseGroups = [
  {
    label: 'Popular Lifts',
    filters: ['all', 'bench-press', 'deadlift', 'squat', 'overhead-press', 'pull-up'],
  },
  {
    label: 'Chest',
    filters: ['bench-press', 'incline-bench-press', 'push-up'],
  },
  {
    label: 'Back',
    filters: ['deadlift', 'romanian-deadlift', 'lat-pulldown', 'barbell-row', 'seated-row', 'pull-up'],
  },
  {
    label: 'Legs & Glutes',
    filters: ['squat', 'front-squat', 'bulgarian-split-squat', 'leg-press', 'hip-thrust', 'lunges'],
  },
  {
    label: 'Shoulders & Arms',
    filters: ['overhead-press', 'lateral-raise', 'bicep-curl', 'hammer-curl', 'tricep-pushdown'],
  },
  {
    label: 'Core & Conditioning',
    filters: ['plank', 'mountain-climber', 'burpee', 'hiit', 'cardio', 'yoga'],
  },
]

function Spinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />
    </div>
  )
}

function sendYouTubeCommand(iframe, func, args = []) {
  if (!iframe?.contentWindow) {
    return
  }

  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: 'command',
      func,
      args,
    }),
    '*',
  )
}

function buildPlayerSrc(videoId) {
  const params = new URLSearchParams({
    autoplay: '1',
    controls: '0',
    enablejsapi: '1',
    fs: '0',
    loop: '1',
    modestbranding: '1',
    mute: '1',
    playsinline: '1',
    playlist: videoId,
    rel: '0',
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

function VideoCard({
  video,
  index,
  isActive,
  shouldLoad,
  liked,
  muted,
  activeLabel,
  cardClassName,
  onLike,
  onShare,
  onToggleMute,
  onElementReady,
  onIframeReady,
}) {
  const cardRef = useRef(null)
  const iframeRef = useRef(null)

  useEffect(() => {
    if (cardRef.current) {
      onElementReady(index, cardRef.current)
    }
  }, [index, onElementReady])

  useEffect(() => {
    if (iframeRef.current) {
      onIframeReady(index, iframeRef.current)
    }
  }, [index, onIframeReady, shouldLoad])

  return (
    <article
      ref={cardRef}
      className={`relative ${cardClassName} snap-start snap-always overflow-hidden bg-stone-950`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.18),transparent_38%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_30%)]" />

      {shouldLoad ? (
        <iframe
          ref={iframeRef}
          className="absolute inset-0 h-full w-full"
          src={buildPlayerSrc(video.videoId)}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/10 via-transparent to-stone-950/82" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-5 sm:px-6">
        <div className="rounded-full border border-white/15 bg-black/35 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur">
          TailorDiet Shorts
        </div>
        <div className="rounded-full border border-white/15 bg-black/35 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur">
          {activeLabel}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-4 pb-8 sm:px-6">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/85">
            {video.channelTitle}
          </p>
          <h2 className="mt-3 text-xl font-semibold leading-tight text-white sm:text-2xl">
            {video.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-200">
            Watch the setup, range of motion, and movement pattern for {activeLabel.toLowerCase()}.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onLike(video.videoId)}
            className="rounded-full border border-white/15 bg-black/35 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/55"
          >
            {liked ? 'Liked' : 'Like'}
          </button>
          <button
            type="button"
            onClick={() => onShare(video)}
            className="rounded-full border border-white/15 bg-black/35 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/55"
          >
            Share
          </button>
          <button
            type="button"
            onClick={() => onToggleMute(video.videoId)}
            className="rounded-full border border-white/15 bg-black/35 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/55"
          >
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </div>
    </article>
  )
}

function FiltersBar({ availableFilters, selectedFilter, onSelect }) {
  const filterMap = useMemo(
    () => new Map(availableFilters.map((filter) => [filter.value, filter.label])),
    [availableFilters],
  )

  return (
    <div className="space-y-4">
      {exerciseGroups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.filters
              .filter((filterValue) => filterMap.has(filterValue))
              .map((filterValue) => (
                <button
                  key={filterValue}
                  type="button"
                  onClick={() => onSelect(filterValue)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedFilter === filterValue
                      ? 'bg-amber-400 text-stone-950'
                      : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {filterMap.get(filterValue)}
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Shorts() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [availableFilters, setAvailableFilters] = useState([{ value: 'all', label: 'All Exercises' }])
  const [videos, setVideos] = useState([])
  const [nextPageToken, setNextPageToken] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeLabel, setActiveLabel] = useState('All Exercises')
  const [likedIds, setLikedIds] = useState({})
  const [mutedIds, setMutedIds] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const itemRefs = useRef(new Map())
  const iframeRefs = useRef(new Map())
  const observerRef = useRef(null)

  useEffect(() => {
    let ignore = false

    async function loadShorts() {
      setIsLoading(true)
      setError('')
      setVideos([])
      setNextPageToken(null)
      setActiveIndex(0)
      itemRefs.current = new Map()
      iframeRefs.current = new Map()

      try {
        const payload = await fetchYouTubeShorts({
          filter: selectedFilter,
          search: searchQuery,
          limit: 9,
        })

        if (ignore) {
          return
        }

        setVideos(payload.videos || [])
        setNextPageToken(payload.nextPageToken || null)
        setActiveLabel(payload.filterLabel || 'Exercise')
        setAvailableFilters(payload.availableFilters || [{ value: 'all', label: 'All Exercises' }])
        setMutedIds(
          Object.fromEntries((payload.videos || []).map((video) => [video.videoId, true])),
        )
      } catch (requestError) {
        if (!ignore) {
          setError(requestError instanceof Error ? requestError.message : 'Something went wrong.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadShorts()

    return () => {
      ignore = true
    }
  }, [selectedFilter, searchQuery])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (!visibleEntries.length) {
          return
        }

        const index = Number(visibleEntries[0].target.getAttribute('data-index'))

        if (Number.isFinite(index)) {
          setActiveIndex(index)
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: [0.35, 0.6, 0.85],
      },
    )

    for (const [index, element] of itemRefs.current.entries()) {
      element.setAttribute('data-index', String(index))
      observerRef.current.observe(element)
    }

    return () => observerRef.current?.disconnect()
  }, [videos])

  useEffect(() => {
    videos.forEach((video, index) => {
      const iframe = iframeRefs.current.get(index)

      if (!iframe) {
        return
      }

      if (index === activeIndex) {
        sendYouTubeCommand(iframe, 'playVideo')
        sendYouTubeCommand(iframe, mutedIds[video.videoId] ? 'mute' : 'unMute')
      } else {
        sendYouTubeCommand(iframe, 'pauseVideo')
      }
    })
  }, [activeIndex, mutedIds, videos])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setToastMessage(''), 2200)
    return () => window.clearTimeout(timeoutId)
  }, [toastMessage])

  const visibleWindow = useMemo(
    () => new Set([activeIndex - 1, activeIndex, activeIndex + 1]),
    [activeIndex],
  )
  const matchingFilters = useMemo(() => {
    const query = searchInput.trim().toLowerCase()

    if (!query) {
      return []
    }

    return availableFilters
      .filter((filter) => filter.value !== 'all')
      .filter((filter) => filter.label.toLowerCase().includes(query))
      .slice(0, 6)
  }, [availableFilters, searchInput])

  useEffect(() => {
    const normalized = searchInput.trim()

    if (!normalized) {
      if (searchQuery) {
        const timeoutId = window.setTimeout(() => {
          setSearchQuery('')
        }, 250)

        return () => window.clearTimeout(timeoutId)
      }

      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setSearchQuery(normalized)
      setSelectedFilter('all')
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput, searchQuery])

  function handleElementReady(index, node) {
    itemRefs.current.set(index, node)
  }

  function handleIframeReady(index, node) {
    iframeRefs.current.set(index, node)
  }

  function handleLike(videoId) {
    setLikedIds((current) => ({
      ...current,
      [videoId]: !current[videoId],
    }))
  }

  async function handleShare(video) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }

      await navigator.clipboard.writeText(video.shareUrl)
      setToastMessage('Video link copied to clipboard.')
    } catch {
      setToastMessage(`Copy this link: ${video.shareUrl}`)
    }
  }

  function handleToggleMute(videoId) {
    setMutedIds((current) => ({
      ...current,
      [videoId]: !current[videoId],
    }))
  }

  async function handleLoadMore() {
    if (!nextPageToken || isLoadingMore) {
      return
    }

    setIsLoadingMore(true)

    try {
      const payload = await fetchYouTubeShorts({
        filter: selectedFilter,
        search: searchQuery,
        pageToken: nextPageToken,
        limit: 9,
      })

      setVideos((current) => {
        const seen = new Set(current.map((video) => video.videoId))
        const nextVideos = (payload.videos || []).filter((video) => !seen.has(video.videoId))
        return [...current, ...nextVideos]
      })
      setNextPageToken(payload.nextPageToken || null)
      setMutedIds((current) => ({
        ...current,
        ...Object.fromEntries((payload.videos || []).map((video) => [video.videoId, true])),
      }))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load more shorts.')
    } finally {
      setIsLoadingMore(false)
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault()
    setSearchQuery(searchInput.trim())
    setSelectedFilter('all')
  }

  function handleClearSearch() {
    setSearchInput('')
    setSearchQuery('')
  }

  return (
    <SiteShell>
      <section className="border-b border-stone-900/10 bg-[linear-gradient(135deg,#171717,#292524)] px-4 py-5 text-white sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/70">
              Exercise form library
            </p>
            <h1 className="mt-3 font-['Georgia'] text-3xl font-bold tracking-tight sm:text-4xl">
              TailorDiet Shorts now lets users filter by exact exercise and study better form.
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-300 sm:text-base">
              Pick a movement like deadlift, bench press, squat, or hip thrust and scroll through
              short technique-focused videos to understand setup, motion, and execution.
            </p>
          </div>

          <div className="mt-6">
            <form onSubmit={handleSearchSubmit} className="mb-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search exercise form videos like deadlift, bench press, goblet squat..."
                className="w-full rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm text-white outline-none placeholder:text-stone-400 focus:border-amber-300"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-300"
                >
                  Search
                </button>
                {(searchInput || searchQuery) ? (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </form>

            {matchingFilters.length > 0 ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {matchingFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(filter.value)
                      setSearchInput('')
                      setSearchQuery('')
                    }}
                    className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            ) : null}

            {searchQuery ? (
              <p className="mb-4 text-sm text-amber-100/85">
                Showing technique shorts for: <span className="font-semibold">{searchQuery}</span>
              </p>
            ) : null}

            <FiltersBar
              availableFilters={availableFilters}
              selectedFilter={selectedFilter}
              onSelect={(value) => {
                setSelectedFilter(value)
                setSearchInput('')
                setSearchQuery('')
              }}
            />
          </div>
        </div>
      </section>

      {isLoading ? <Spinner /> : null}

      {!isLoading && error ? (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center">
            <h2 className="text-2xl font-semibold text-rose-900">Shorts are unavailable right now.</h2>
            <p className="mt-3 text-sm leading-6 text-rose-700">{error}</p>
          </div>
        </section>
      ) : null}

      {!isLoading && !error && videos.length === 0 ? (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
          <div className="rounded-[2rem] border border-stone-900/10 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-stone-950">No videos found for {activeLabel}.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Try another exercise filter or check your backend YouTube API configuration.
            </p>
          </div>
        </section>
      ) : null}

      {!isLoading && !error && videos.length > 0 ? (
        <>
          <div className={`${FEED_VIEWPORT_CLASS} snap-y snap-mandatory overflow-y-auto`}>
            {videos.map((video, index) => (
              <VideoCard
                key={video.videoId}
                video={video}
                index={index}
                isActive={index === activeIndex}
                shouldLoad={visibleWindow.has(index)}
                liked={Boolean(likedIds[video.videoId])}
                muted={mutedIds[video.videoId] ?? true}
                activeLabel={activeLabel}
                cardClassName={FEED_VIEWPORT_CLASS}
                onLike={handleLike}
                onShare={handleShare}
                onToggleMute={handleToggleMute}
                onElementReady={handleElementReady}
                onIframeReady={handleIframeReady}
              />
            ))}
          </div>

          <div className="border-t border-stone-900/10 bg-white px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto flex max-w-7xl justify-center">
              {nextPageToken ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-100 transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoadingMore ? 'Loading more...' : `Load more ${activeLabel} shorts`}
                </button>
              ) : (
                <p className="text-sm text-stone-500">You have reached the end of this {activeLabel.toLowerCase()} feed.</p>
              )}
            </div>
          </div>
        </>
      ) : null}

      {toastMessage ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-950 px-4 py-3 text-sm font-medium text-white shadow-xl">
          {toastMessage}
        </div>
      ) : null}
    </SiteShell>
  )
}

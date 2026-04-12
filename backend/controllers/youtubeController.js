const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";
const YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos";
const CACHE_TTL_MS = 10 * 60 * 1000;
const DEFAULT_PAGE_SIZE = 9;
const MAX_PAGE_SIZE = 15;

const exerciseFilters = {
  all: { label: "All Exercises", query: "exercise workout shorts proper form" },
  "bench-press": { label: "Bench Press", query: "bench press shorts proper form tutorial" },
  "incline-bench-press": {
    label: "Incline Bench Press",
    query: "incline bench press shorts proper form tutorial",
  },
  "push-up": { label: "Push-Up", query: "push up shorts correct form tutorial" },
  deadlift: { label: "Deadlift", query: "deadlift shorts proper form tutorial" },
  "romanian-deadlift": {
    label: "Romanian Deadlift",
    query: "romanian deadlift shorts proper form tutorial",
  },
  squat: { label: "Squat", query: "squat shorts proper form tutorial" },
  "front-squat": { label: "Front Squat", query: "front squat shorts proper form tutorial" },
  "bulgarian-split-squat": {
    label: "Bulgarian Split Squat",
    query: "bulgarian split squat shorts proper form tutorial",
  },
  "leg-press": { label: "Leg Press", query: "leg press shorts proper form tutorial" },
  "hip-thrust": { label: "Hip Thrust", query: "hip thrust shorts proper form tutorial" },
  lunges: { label: "Lunges", query: "walking lunges shorts proper form tutorial" },
  "pull-up": { label: "Pull-Up", query: "pull up shorts proper form tutorial" },
  "lat-pulldown": { label: "Lat Pulldown", query: "lat pulldown shorts proper form tutorial" },
  "barbell-row": { label: "Barbell Row", query: "barbell row shorts proper form tutorial" },
  "seated-row": { label: "Seated Row", query: "seated cable row shorts proper form tutorial" },
  "overhead-press": {
    label: "Overhead Press",
    query: "overhead press shorts proper form tutorial",
  },
  "lateral-raise": {
    label: "Lateral Raise",
    query: "lateral raise shorts proper form tutorial",
  },
  "bicep-curl": { label: "Bicep Curl", query: "bicep curl shorts proper form tutorial" },
  "hammer-curl": { label: "Hammer Curl", query: "hammer curl shorts proper form tutorial" },
  "tricep-pushdown": {
    label: "Tricep Pushdown",
    query: "tricep pushdown shorts proper form tutorial",
  },
  plank: { label: "Plank", query: "plank shorts correct form tutorial" },
  "mountain-climber": {
    label: "Mountain Climber",
    query: "mountain climber shorts proper form tutorial",
  },
  burpee: { label: "Burpee", query: "burpee shorts proper form tutorial" },
  yoga: { label: "Yoga", query: "yoga shorts tutorial proper form" },
  hiit: { label: "HIIT", query: "hiit workout shorts tutorial" },
  cardio: { label: "Cardio", query: "cardio workout shorts tutorial" },
};

const responseCache = new Map();

function getCacheKey({ filter, search, pageToken, limit }) {
  return JSON.stringify({ filter, search, pageToken, limit });
}

function readCache(key) {
  const cached = responseCache.get(key);

  if (!cached) {
    return null;
  }

  if (Date.now() > cached.expiresAt) {
    responseCache.delete(key);
    return null;
  }

  return cached.value;
}

function writeCache(key, value) {
  responseCache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function parseISODurationToSeconds(duration) {
  const match = String(duration || "").match(
    /^P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/
  );

  if (!match) {
    return Number.POSITIVE_INFINITY;
  }

  const hours = Number.parseInt(match[1] || "0", 10);
  const minutes = Number.parseInt(match[2] || "0", 10);
  const seconds = Number.parseInt(match[3] || "0", 10);

  return hours * 3600 + minutes * 60 + seconds;
}

function normalizeFilter(value) {
  const key = String(value || "all").trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(exerciseFilters, key) ? key : "all";
}

async function fetchJson(url) {
  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error?.message || "YouTube request failed.");
  }

  return payload;
}

async function searchExerciseShorts({ apiKey, filter, pageToken, limit }) {
  return searchYouTubeShorts({
    apiKey,
    query: exerciseFilters[filter].query,
    pageToken,
    limit,
  });
}

async function searchYouTubeShorts({ apiKey, query, pageToken, limit }) {
  const params = new URLSearchParams({
    key: apiKey,
    part: "snippet",
    type: "video",
    videoEmbeddable: "true",
    videoSyndicated: "true",
    maxResults: String(Math.min(25, Math.max(limit + 8, DEFAULT_PAGE_SIZE))),
    order: "relevance",
    q: query,
  });

  if (pageToken) {
    params.set("pageToken", pageToken);
  }

  const searchResponse = await fetchJson(`${YOUTUBE_SEARCH_URL}?${params.toString()}`);
  const orderedIds = [];

  for (const item of searchResponse.items || []) {
    const videoId = item?.id?.videoId;

    if (videoId) {
      orderedIds.push(videoId);
    }
  }

  if (!orderedIds.length) {
    return {
      videos: [],
      nextPageToken: searchResponse.nextPageToken || null,
    };
  }

  const detailsParams = new URLSearchParams({
    key: apiKey,
    part: "contentDetails,snippet",
    id: orderedIds.join(","),
    maxResults: String(Math.min(50, orderedIds.length)),
  });

  const detailsResponse = await fetchJson(`${YOUTUBE_VIDEOS_URL}?${detailsParams.toString()}`);
  const detailsById = new Map((detailsResponse.items || []).map((item) => [item.id, item]));

  const videos = orderedIds
    .map((videoId) => detailsById.get(videoId))
    .filter(Boolean)
    .filter((item) => parseISODurationToSeconds(item.contentDetails?.duration) <= 60)
    .slice(0, limit)
    .map((item) => ({
      videoId: item.id,
      title: item.snippet?.title || "TailorDiet Shorts",
      thumbnail:
        item.snippet?.thumbnails?.maxres?.url ||
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.medium?.url ||
        item.snippet?.thumbnails?.default?.url ||
        "",
      channelTitle: item.snippet?.channelTitle || "YouTube creator",
      embedUrl: `https://www.youtube.com/embed/${item.id}`,
      shareUrl: `https://www.youtube.com/watch?v=${item.id}`,
      durationSeconds: parseISODurationToSeconds(item.contentDetails?.duration),
    }));

  return {
    videos,
    nextPageToken: searchResponse.nextPageToken || null,
  };
}

export async function getYouTubeShorts(req, res) {
  if (!process.env.YOUTUBE_API_KEY) {
    return res.status(500).json({
      error: "YOUTUBE_API_KEY is missing on the backend.",
    });
  }

  const filter = normalizeFilter(req.query.filter || req.query.category);
  const search = String(req.query.search || "").trim().slice(0, 80);
  const pageToken = String(req.query.pageToken || "").trim();
  const limit = Math.min(
    MAX_PAGE_SIZE,
    parsePositiveInteger(req.query.limit, DEFAULT_PAGE_SIZE)
  );
  const cacheKey = getCacheKey({ filter, search, pageToken, limit });
  const cached = readCache(cacheKey);

  if (cached) {
    return res.json({
      ...cached,
      cached: true,
    });
  }

  try {
    const payload = search
      ? await searchYouTubeShorts({
          apiKey: process.env.YOUTUBE_API_KEY,
          query: `${search} exercise shorts proper form tutorial`,
          pageToken,
          limit,
        })
      : await searchExerciseShorts({
          apiKey: process.env.YOUTUBE_API_KEY,
          filter,
          pageToken,
          limit,
        });

    const responseBody = {
      filter,
      filterLabel: search ? `Search: ${search}` : exerciseFilters[filter].label,
      search,
      availableFilters: Object.entries(exerciseFilters).map(([value, entry]) => ({
        value,
        label: entry.label,
      })),
      videos: payload.videos,
      nextPageToken: payload.nextPageToken || null,
      cached: false,
    };

    writeCache(cacheKey, responseBody);

    return res.json(responseBody);
  } catch (error) {
    return res.status(502).json({
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while fetching YouTube Shorts.",
    });
  }
}

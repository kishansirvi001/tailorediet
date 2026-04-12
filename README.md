# TailorDiet

TailorDiet uses a Vite frontend and an Express backend for fitness tools, AI planning, chat, and a YouTube Shorts-style exercise feed.

## Folder Structure

```text
tailordiet/
  backend/
    controllers/
    routes/
    middleware/
    lib/
    .env.example
    server.js
  src/
    components/
    pages/
    services/
  .env.example
```

## Environment Variables

Frontend variables live in [`.env.example`](C:/Users/kisha/tailordiet/.env.example).

Backend variables live in [`backend/.env.example`](C:/Users/kisha/tailordiet/backend/.env.example) and should be copied to `backend/.env` for local development.

Required backend variables:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=your-jwt-secret
GEMINI_API_KEY=
YOUTUBE_API_KEY=your_api_key_here
OTP_EMAIL_FROM=your-sender@example.com
OTP_EMAIL_FROM_NAME=TailorDiet
BREVO_API_KEY=
MESSAGE_CENTRAL_CUSTOMER_ID=
MESSAGE_CENTRAL_KEY=
MESSAGE_CENTRAL_EMAIL=
MESSAGE_CENTRAL_COUNTRY_CODE=91
```

Notes:
- `backend/.env` is the only backend env file used locally.
- `YOUTUBE_API_KEY` powers `/api/youtube/shorts`.
- `VITE_API_BASE_URL` can stay empty in local development to use the Vite proxy.

## Install And Run

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Run the backend:

```bash
cd backend
npm start
```

Run the frontend:

```bash
npm run dev
```

## YouTube Shorts API

Endpoint:

```text
GET /api/youtube/shorts?filter=deadlift&limit=9
```

Optional query params:
- `filter`: examples include `all`, `bench-press`, `deadlift`, `squat`, `hip-thrust`, `pull-up`, `lat-pulldown`, `plank`, `yoga`
- `limit`: max `15`
- `pageToken`: fetch the next page of results

Example response:

```json
{
  "filter": "deadlift",
  "filterLabel": "Deadlift",
  "availableFilters": [
    { "value": "all", "label": "All Exercises" },
    { "value": "deadlift", "label": "Deadlift" }
  ],
  "videos": [
    {
      "videoId": "abc123",
      "title": "15 Minute Dumbbell Burner",
      "thumbnail": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      "channelTitle": "Fit Coach",
      "embedUrl": "https://www.youtube.com/embed/abc123",
      "shareUrl": "https://www.youtube.com/watch?v=abc123",
      "durationSeconds": 42
    }
  ],
  "nextPageToken": "CAoQAA",
  "cached": false
}
```

The backend filters results to videos that are 60 seconds or shorter, uses in-memory caching, and embeds videos without downloading or storing media files.

## Frontend Shorts Page

The Shorts feed lives at [`/shorts`](C:/Users/kisha/tailordiet/src/pages/Shorts.jsx) and includes:
- vertical snap scrolling
- intersection-based playback control
- exercise-specific filters for technique videos
- mute/unmute, like, and share UI
- category filters
- lazy iframe loading
- load-more pagination

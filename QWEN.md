# Alimanaka — Liturgical Calendar (MERN)

## Project Overview

A Dockerized full-stack MERN (MongoDB, Express, Next.js, Node.js) application that displays the liturgical calendar for the Malagasy Lutheran Church (FLM - Fiangonana Loterana Malagasy). The app provides an interactive calendar UI with liturgical season colors, event details (service times, Bible readings, offerings, communion indicators), and auto-scrolling to today's date.

### Key Features
- **Auto-scroll**: Automatically focuses on today's event (or next available) on load or month switch
- **Today indicator**: Highlights today's event card with a distinctive border and "ANIO" badge
- **Liturgical Colors**: Card UI dynamically reflects church season colors with Malagasy labels (Fotsy, Maitso, Mena, etc.)
- **Malagasy UI**: Month tabs display Malagasy names (Janoary, Febroary, Marsa...)
- **Lora Font**: Loaded via `next/font/google` for optimal typography
- **API Proxy**: Next.js route handler proxies `/api/*` to the backend at runtime
- **Error Boundary**: Graceful error handling with retry capability
- **Infrastructure-Agnostic**: Works locally or deployed anywhere via environment variables

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14 (App Router), React 18, Material UI (MUI) 5, Axios, Emotion |
| **Backend** | Node.js 20, Express 4, Mongoose 7, Morgan (logging) |
| **Database** | MongoDB 7.0 |
| **Infrastructure** | Docker, Docker Compose |
| **Security** | Helmet, CORS, express-rate-limit, express-validator |

## Project Structure

```
alimanaka-2026-mern/
├── docker-compose.yml          # Orchestrates services with health checks
├── backend/
│   ├── server.js               # Express entry (middleware, routes, health check, morgan)
│   ├── seed.js                 # Database seeding script
│   ├── alimanaka_extracted.json # Source data from Notion
│   ├── models/Event.js         # Mongoose schema with compound index & chronological sort
│   ├── controllers/eventController.js  # Business logic
│   ├── routes/eventRoutes.js   # Express routes with validation
│   ├── middleware/errorHandler.js       # Central error handling
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js       # Root layout with Lora font + MUI theme
│   │   │   ├── page.js         # Main calendar page (client component)
│   │   │   ├── error.js        # Route-level error boundary
│   │   │   ├── icon.js         # Dynamic favicon (32x32 PNG)
│   │   │   ├── apple-icon.js   # Apple touch icon (180x180 PNG)
│   │   │   └── api/
│   │   │       └── [...path]/
│   │   │           └── route.js  # API proxy to backend
│   │   ├── lib/
│   │   │   ├── api.js          # Centralized Axios API client
│   │   │   └── constants.js    # Malagasy months, liturgical colors, config
│   │   └── theme/
│   │       └── MUIThemeProvider.js  # MUI theme configuration
│   ├── next.config.js          # Next.js configuration (standalone output)
│   ├── Dockerfile              # Multi-stage production build
│   └── package.json
└── README.md
```

## Development Commands

### Docker (Recommended)

```bash
# Start all services (builds images if needed)
docker compose up -d --build

# Seed the database with liturgical event data
docker compose exec backend node seed.js

# Stop all services
docker compose down
```

### Backend (Standalone)

```bash
cd backend
npm install
npm run dev    # development (nodemon)
npm start      # production
```

### Frontend (Standalone)

```bash
cd frontend
npm install
npm run dev    # development
npm run build  # production build
npm start      # production server
```

## Service Ports

| Service | Host Port (default) | Container Port |
|---------|-------------------|----------------|
| Frontend | 8004 (configurable via `FRONTEND_PORT`) | 3000 |
| Backend API | 8005 (configurable via `BACKEND_PORT`) | 5000 |

## API Endpoints

### GET `/api/events`
Retrieve liturgical events sorted chronologically. Supports optional query parameters:
- `year` (integer) - Filter by year
- `month` (string) - Filter by month name (lowercase)

### GET `/api/events/months`
Returns a list of distinct months that have events, sorted chronologically.

### GET `/api/health`
Health check endpoint. Returns DB connection status, uptime, and timestamp.

## Data Model

### Event Schema (`models/Event.js`)

```javascript
{
  year: Number,          // e.g., 2026
  month: String,         // lowercase month name (enum: january–december)
  date: String,          // e.g., "5" or "12-15"
  day: String,           // day of week (Malagasy)
  title: String,         // event title
  color: String | null,  // liturgical color (enum: white, green, red, purple, brown, yellow, black)
  location: String,      // event location
  fidirana: [String],    // service times
  vakiteny: [String],    // Bible readings
  rakitra: [String],     // offerings/financial items
  fandraisana: Boolean,  // communion indicator
  description: [String], // additional notes
  createdAt: Date,       // auto-generated
  updatedAt: Date        // auto-generated
}
```

### Database Indexes
- Compound index on `{ year: 1, month: 1, date: 1 }` for optimal query performance

## Environment Variables

### Backend
| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | `mongodb://localhost:27017/alimanaka` | MongoDB connection string |
| `CORS_ORIGIN` | `*` | Allowed CORS origin |
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

### Frontend
| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_API_URL` | `http://localhost:8005` | Backend base URL (proxy route handler target) |
| `LITURGICAL_YEAR` | *(current year)* | Liturgical year to display |

### Docker Compose
| Variable | Default | Description |
|----------|---------|-------------|
| `FRONTEND_PORT` | `8004` | Frontend host port mapping |
| `BACKEND_PORT` | `8005` | Backend host port mapping |

## Docker Health Checks

All services include health checks and `restart: unless-stopped`:
- **MongoDB**: `mongosh --eval "db.adminCommand('ping')"` every 10s
- **Backend**: `wget --spider http://localhost:5000/api/health` every 10s
- **Frontend**: `wget --spider http://localhost:3000` every 15s

## API Proxy Architecture

The frontend uses a Next.js App Router catch-all route handler (`src/app/api/[...path]/route.js`) to proxy all `/api/*` requests to the backend. This allows:

1. The frontend uses relative URLs (`/api/events`) — no hardcoded backend URL in the client bundle
2. The proxy resolves `BACKEND_API_URL` from the runtime environment (works in Docker, standalone, or cloud)
3. Browsers never directly contact the backend — all traffic goes through the frontend

```
Browser → /api/events → Next.js route handler → BACKEND_API_URL/api/events → Backend
```

## Data Source

Liturgical event data is parsed from a structured Notion page using a custom extraction engine that handles Malagasy text, dates, and liturgical metadata. The extracted JSON (`alimanaka_extracted.json`) is loaded into MongoDB via the `seed.js` script.

## Development Notes

- The frontend uses Next.js 14 App Router with client components for interactive UI
- Month tabs display Malagasy names (Janoary, Febroary, Marsa, Aprily, Mey, Jona, Jolay, Aogositra, Septambra, Oktobra, Novambra, Desambra)
- Liturgical colors show Malagasy labels (Fotsy, Maitso, Mena, Volomparasy, etc.)
- Backend API is read-only (GET endpoints only) with rate limiting and request logging (morgan)
- MongoDB data persists via Docker volume (`mongodb_data`)
- The UI displays Malagasy language text throughout (titles, labels, error messages)
- Frontend Dockerfile uses multi-stage build for optimized production image with standalone output
- Backend Dockerfile uses multi-stage build to minimize production image
- Events are sorted chronologically using a custom `findChronological()` static method with proper month ordering
- API responses include `Cache-Control` headers (24h with 7d stale-while-revalidate)

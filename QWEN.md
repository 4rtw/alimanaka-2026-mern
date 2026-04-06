# Alimanaka 2026 - Liturgical Calendar (MERN)

## Project Overview

A Dockerized full-stack MERN (MongoDB, Express, Next.js, Node.js) application that displays the 2026 liturgical calendar for the Malagasy Lutheran Church (FLM - Fiangonana Loterana Malagasy). The app provides an interactive calendar UI with liturgical season colors, event details (service times, Bible readings, offerings, communion indicators), and auto-scrolling to today's date.

### Key Features
- **Auto-scroll**: Automatically focuses on today's event (or next available) on load or month switch
- **Today indicator**: Highlights today's event card with a distinctive border and "ANIO" badge
- **Liturgical Colors**: Card UI dynamically reflects church season colors with Malagasy labels (Fotsy, Maitso, Mena, etc.)
- **Malagasy UI**: Month tabs display Malagasy names (Janoary, Febroary, Marsa...), dates in Malagasy (Alahady, Alatsinainy...)
- **Lora Font**: Loaded via `next/font/google` for optimal typography
- **Material UI**: Responsive design with specialized event cards
- **Location Awareness**: Displays event locations with map pin icons
- **Detailed Metadata**: Service times (`fidirana`), Bible readings (`vakiteny`), offerings (`rakitra`), communion badges (`fandraisana`)
- **Error Boundary**: Graceful error handling with retry capability
- **Tailscale Ready**: Pre-configured for secure Tailscale HTTPS endpoints

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14 (App Router), React 18, Material UI (MUI) 5, Axios, Emotion |
| **Backend** | Node.js, Express 4, Mongoose 7, Morgan (logging) |
| **Database** | MongoDB 7.0 |
| **Infrastructure** | Docker, Docker Compose, Tailscale |
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
│   │   │   └── components/
│   │   │       └── EventCard.js  # Liturgical event card with today badge
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
docker exec alimanaka-backend-new node seed.js

# Stop all services
docker compose down
```

### Backend (Standalone)

```bash
cd backend

# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

### Frontend (Standalone)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Service Ports

| Service | Host Port | Container Port |
|---------|-----------|----------------|
| Frontend | 8004 | 3000 |
| Backend API | 8005 | 5000 |
| MongoDB | 27018 | 27017 |

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
- `MONGODB_URI` - MongoDB connection string (default: `mongodb://mongodb:27017/alimanaka`)
- `CORS_ORIGIN` - Allowed CORS origin (default: Tailscale URL)
- `PORT` - Server port (default: `5000`)
- `NODE_ENV` - Environment mode
- `RATE_LIMIT_WINDOW_MS` - Rate limit window (default: `900000`)
- `RATE_LIMIT_MAX` - Max requests per window (default: `100`)

### Frontend
- `API_URL` - Backend API base URL (configured via docker-compose and next.config.js)

## Docker Health Checks

All services include health checks and `restart: unless-stopped`:
- **MongoDB**: `mongosh --eval "db.adminCommand('ping')"` every 10s
- **Backend**: `wget --spider http://localhost:5000/api/health` every 10s
- **Frontend**: Depends on backend healthy state

## Tailscale Configuration

The application is pre-configured for Tailscale HTTPS access:
- **Frontend**: `https://alimanaka.chantilly-shaula.ts.net/`
- **Backend**: `https://alimanaka.chantilly-shaula.ts.net:8443/api`

## Data Source

Liturgical event data is parsed from a structured Notion page using a custom extraction engine that handles Malagasy text, dates, and liturgical metadata. The extracted JSON (`alimanaka_extracted.json`) is loaded into MongoDB via the `seed.js` script.

## Development Notes

- The frontend uses Next.js 14 App Router with client components for interactive UI
- Month tabs display Malagasy names (Janoary, Febroary, Marsa, Aprily, Mey, Jona, Jolay, Aogositra, Septambra, Oktobra, Novambra, Desambra)
- Liturgical colors show Malagasy labels (Fotsy, Maitso, Mena, Volomparasy, etc.)
- Backend API is read-only (GET endpoints only) with rate limiting and request logging (morgan)
- MongoDB data persists via Docker volume (`mongodb_data_new`)
- The UI displays Malagasy language text throughout (titles, labels, error messages)
- Frontend Dockerfile uses multi-stage build for optimized production image with standalone output
- Backend uses Node.js 20-alpine (MongoDB 7.0)
- Events are sorted chronologically using a custom `findChronological()` static method with proper month ordering

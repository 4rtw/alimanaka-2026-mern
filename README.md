# Alimanaka — Liturgical Calendar (MERN)

A Dockerized full-stack MERN (MongoDB, Express, Next.js, Node.js) application that displays the liturgical calendar for the Malagasy Lutheran Church (FLM - Fiangonana Loterana Malagasy).

## 🚀 Features

- **Auto-scroll**: Automatically focus on today's event (or the next available) upon loading or switching months.
- **Today Indicator**: Highlights today's event card with a bold outline and "ANIO" badge.
- **Interactive UI**: Modern card layout with hover effects and responsive grid.
- **Liturgical Colors**: Card UI automatically updates colors based on the church season, with Malagasy labels (Fotsy, Maitso, Mena, Volomparasy, etc.).
- **Malagasy Interface**: Month tabs display Malagasy names (Janoary, Febroary, Marsa, Aprily, Mey, Jona...).
- **Configurable Year**: Set `LITURGICAL_YEAR` to display any year's calendar.
- **Infrastructure-Agnostic**: Works locally via Docker Compose or deployed anywhere via environment variables.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Material UI (MUI), Axios, Emotion.
- **Backend**: Node.js, Express, Morgan (logging).
- **Database**: MongoDB 7.0 (Mongoose).
- **Infrastructure**: Docker, Docker Compose.

## 🐳 Getting Started

### Prerequisites

- Docker and Docker Compose

### Quick Start (Local)

```bash
# Start all services
docker compose up -d --build

# Seed the database
docker compose exec backend node seed.js
```

### Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8004 |
| Backend API | http://localhost:8005/api |
| Health Check | http://localhost:8005/api/health |

### Configuration

All settings are controlled via environment variables. Copy `.env.example` files or set variables in docker-compose:

#### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `MONGODB_URI` | `mongodb://localhost:27017/alimanaka` | MongoDB connection string |
| `CORS_ORIGIN` | `*` | Allowed CORS origin (set to your frontend URL in production) |
| `NODE_ENV` | `development` | Environment mode |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

#### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://localhost:8005/api` | Backend API base URL |
| `LITURGICAL_YEAR` | *(current year)* | Liturgical year to display |

#### Docker Compose

| Variable | Default | Description |
|----------|---------|-------------|
| `FRONTEND_PORT` | `8004` | Frontend host port mapping |
| `BACKEND_PORT` | `8005` | Backend host port mapping |
| `API_URL` | `http://backend:5000/api` | Frontend → Backend URL (internal Docker network) |
| `CORS_ORIGIN` | `*` | Backend CORS origin |

### Standalone (Non-Docker)

```bash
# Backend
cd backend
cp .env.example .env   # edit as needed
npm install
npm start

# Frontend (in another terminal)
cd frontend
cp .env.example .env   # edit as needed
npm install
npm run dev
```

## 📊 Data Source

Liturgical event data is parsed from a structured Notion page using a custom extraction engine that handles Malagasy text, dates, and liturgical metadata. The extracted JSON (`backend/alimanaka_extracted.json`) is loaded into MongoDB via the `seed.js` script.

## 🔌 API Endpoints

### GET `/api/events`
Retrieve liturgical events sorted chronologically.
- `year` (integer) — Filter by year
- `month` (string) — Filter by month name (lowercase)

### GET `/api/events/months`
Returns a list of distinct months with events, sorted chronologically.

### GET `/api/health`
Health check endpoint. Returns DB status, uptime, and timestamp.

---
*Developed with Qwen Code.*

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

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, Material UI 5, Axios, Emotion |
| **Backend** | Node.js 20, Express 4, Morgan (logging) |
| **Database** | MongoDB 7.0 (Mongoose 7) |
| **Infrastructure** | Docker, Docker Compose |

## 🐳 Quick Start (Local)

### Prerequisites

- Docker and Docker Compose

### Run

```bash
# Clone the repository
git clone https://github.com/4rtw/alimanaka-2026-mern.git
cd alimanaka-2026-mern

# Start all services
docker compose up -d --build

# Seed the database with liturgical event data
docker compose exec backend node seed.js
```

### Access

| Service | URL |
|---------|-----|
| Frontend | http://localhost:8004 |
| Backend API | http://localhost:8005/api |
| Health Check | http://localhost:8005/api/health |

## 📦 Deployment

The application is designed to run anywhere. Choose the deployment method that fits your infrastructure.

### Option 1: Docker Compose (VPS / Dedicated Server)

The simplest production deployment. Requires Docker and Docker Compose on the host.

```bash
# Deploy with custom ports
FRONTEND_PORT=80 BACKEND_PORT=5000 docker compose up -d --build

# Deploy with custom CORS (restrict to your domain)
CORS_ORIGIN=https://yourdomain.com docker compose up -d --build

# Deploy for a different year
docker compose exec -e BACKEND_API_URL=http://backend:5000 frontend sh -c 'echo "LITURGICAL_YEAR=2027" >> .env.local'
```

#### Production Checklist

- [ ] Set `CORS_ORIGIN` to your actual frontend domain (not `*`)
- [ ] Set `NODE_ENV=production` on the backend
- [ ] Use a reverse proxy (Nginx, Caddy, Traefik) for TLS
- [ ] Enable Docker health checks (already configured)
- [ ] Set up automated backups of the MongoDB volume
- [ ] Consider adding `restart: always` (default is `unless-stopped`)

#### Example with Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option 2: Docker Compose with External MongoDB

If you already run MongoDB elsewhere, point the backend to it:

```bash
MONGODB_URI=mongodb://user:password@mongo-host:27017/alimanaka \
  docker compose up -d --build backend frontend

# Skip starting the local MongoDB service
# (remove mongodb from the compose command or use a separate compose file)
```

### Option 3: Standalone (No Docker)

Run services directly on the host without containers.

#### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your settings
npm install --production
npm start
```

#### Frontend

```bash
cd frontend
cp .env.example .env
# Set BACKEND_API_URL to your backend URL
export BACKEND_API_URL=http://your-backend-host:5000
npm install
npm run build
npm start
```

#### Running as systemd Services

```ini
# /etc/systemd/system/alimanaka-backend.service
[Unit]
Description=Alimanaka Backend API
After=network.target mongod.service

[Service]
Type=simple
WorkingDirectory=/opt/alimanaka/backend
Environment=NODE_ENV=production
Environment=MONGODB_URI=mongodb://localhost:27017/alimanaka
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```ini
# /etc/systemd/system/alimanaka-frontend.service
[Unit]
Description=Alimanaka Frontend (Next.js)
After=network.target alimanaka-backend.service

[Service]
Type=simple
WorkingDirectory=/opt/alimanaka/frontend
Environment=NODE_ENV=production
Environment=BACKEND_API_URL=http://localhost:5000
ExecStart=/usr/bin/node server.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### Option 4: Cloud Platforms

#### Railway / Render / Fly.io

Each service can be deployed as a separate app:

| Service | Build Command | Start Command | Port |
|---------|--------------|---------------|------|
| Backend | `npm install --production` | `node server.js` | `5000` |
| Frontend | `npm install && npm run build` | `node server.js` | `3000` |

**Environment variables to set:**

**Backend:**
```
MONGODB_URI=<your-mongodb-connection-string>
CORS_ORIGIN=https://your-frontend-url.com
NODE_ENV=production
```

**Frontend:**
```
BACKEND_API_URL=https://your-backend-url.com
```

#### DigitalOcean App Platform

1. Create a MongoDB database (or use MongoDB Atlas)
2. Deploy `backend/` as a web service
3. Deploy `frontend/` as a web service
4. Set environment variables as described above
5. Run `node seed.js` as a one-time job component

### Option 5: Tailscale Network

For internal/private access without public exposure:

```bash
# Install Tailscale on the host
curl -fsSL https://tailscale.com/install.sh | sh

# Start the app
docker compose up -d --build

# The app is accessible via your Tailscale IP
# https://<tailscale-ip>:8004
```

Or use Tailscale Serve/HTTPS:

```bash
tailscale serve --bg --https=443 http://localhost:8004
# Access via: https://<tailnet-name>.ts.net
```

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `MONGODB_URI` | `mongodb://localhost:27017/alimanaka` | MongoDB connection string |
| `CORS_ORIGIN` | `*` | Allowed CORS origin (set to your frontend URL in production) |
| `NODE_ENV` | `development` | Environment mode |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window in ms (15 min) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_API_URL` | `http://localhost:8005` | Backend base URL (no trailing `/api`) |
| `LITURGICAL_YEAR` | *(current year)* | Liturgical year to display |

### Docker Compose Variables

Set these before `docker compose up`:

```bash
FRONTEND_PORT=80        # Host port for frontend
BACKEND_PORT=5000       # Host port for backend
CORS_ORIGIN=https://example.com  # CORS restriction
docker compose up -d
```

## 📊 Data Source

Liturgical event data is parsed from a structured Notion page using a custom extraction engine that handles Malagasy text, dates, and liturgical metadata. The extracted JSON (`backend/alimanaka_extracted.json`) is loaded into MongoDB via the `seed.js` script.

### Re-seeding Data

```bash
# Docker
docker compose exec backend node seed.js

# Standalone
cd backend && node seed.js
```

> ⚠️ **Warning:** Re-seeding deletes all existing data and replaces it with the source JSON.

### Updating Calendar Data

1. Edit `backend/alimanaka_extracted.json` with new events
2. Re-seed: `docker compose exec backend node seed.js`

## 🔌 API Endpoints

### GET `/api/events`
Retrieve liturgical events sorted chronologically.

| Parameter | Type | Description |
|-----------|------|-------------|
| `year` | integer | Filter by year (e.g., `2026`) |
| `month` | string | Filter by month name (lowercase, e.g., `january`) |

**Response:**
```json
[
  {
    "_id": "...",
    "year": 2026,
    "month": "january",
    "date": "01",
    "day": "Alakamisy",
    "title": "TAOM-BAOVAO",
    "color": "white",
    "fidirana": ["6:30", "10"],
    "vakiteny": ["Isa 55:1-9", "Heb. 13:8-16", ...],
    "rakitra": ["Raharaha ankapobeny", ...],
    "fandraisana": true,
    "description": ["🙏 Androm-bavaka ho an'ny FIFIL"]
  }
]
```

### GET `/api/events/months`
Returns a list of distinct months with events, sorted chronologically.

### GET `/api/health`
Health check endpoint.

```json
{
  "status": "ok",
  "db": "connected",
  "uptime": 1234.56,
  "timestamp": "2026-04-06T19:55:47.359Z"
}
```

## 🏗 Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────┐
│   Browser   │────▶│   Next.js   │────▶│  Express  │
│             │     │  Frontend   │     │  Backend  │
│  :8004      │     │  (:3000)    │     │  (:5000)  │
└─────────────┘     └──────┬──────┘     └────┬─────┘
                           │                 │
                    /api/* proxy      GET /api/events
                    (runtime)        GET /api/health
                                     GET /api/events/months
                                                    │
                                              ┌─────▼─────┐
                                              │  MongoDB   │
                                              │  (:27017)  │
                                              └───────────┘
```

The frontend uses a Next.js route handler (`/api/[...path]/route.js`) to proxy all API requests to the backend at runtime. This allows the frontend to use relative URLs (`/api/*`) while the actual backend URL is configured via the `BACKEND_API_URL` environment variable.

## 📝 License

Fampiasana an-tsitrapo ho an'ny Fiangonana — Free for church use.

---
*Developed with Qwen Code.*

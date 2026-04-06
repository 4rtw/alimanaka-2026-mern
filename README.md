# Alimanaka 2026 - Liturgical Calendar (MERN)

A Dockerized full-stack MERN (MongoDB, Express, React, Node.js) application displaying the 2026 liturgical calendar for the Malagasy Lutheran Church (FLM).

## 🚀 Features

- **Auto-scroll**: Automatically focus on today's event (or the next available) upon loading or switching months.
- **Interactive UI**: Modern card layout with hover effects and responsive grid.
- **Lithurgical Colors**: Card UI automatically updates colors based on the church season (white, green, red, purple, etc.).
- **Material UI Interface**: Responsive design with specialized cards for liturgical events.
- **Location Awareness**: Displays event locations (e.g., "Ankadinonndry Sakay", "Fit. Itaosy") with map pin icons.
- **Detailed Metadata**: 
  - `fidirana`: Service times
  - `vakiteny`: Bible readings
  - `rakitra`: Specific offerings
  - `fandraisana`: Holy Communion indicator badge
- **Tailscale Ready**: Configured for secure access via Tailscale HTTPS.

## 🛠 Tech Stack

- **Frontend**: React, Material UI (MUI), Axios, Emotion.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (Mongoose).
- **Infrastructure**: Docker, Docker Compose, Tailscale.

## 🐳 Getting Started

### Prerequisites

- Docker and Docker Compose
- Tailscale (optional, for secure remote access)

### Setup & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/4rtw/alimanaka-2026-mern.git
   cd alimanaka-2026-mern
   ```

2. **Start the containers:**
   ```bash
   docker compose up -d --build
   ```

3. **Seed the database:**
   The data is extracted from Notion and ready to be imported.
   ```bash
   docker exec alimanaka-backend-new node seed.js
   ```

### Access Ports

- **Frontend**: `http://localhost:8004` (Mapped to 3000 inside container)
- **Backend API**: `http://localhost:8005/api` (Mapped to 5000 inside container)

## 🌐 Network Configuration

The application is pre-configured for the following Tailscale HTTPS endpoints:
- **Frontend**: `https://alimanaka.chantilly-shaula.ts.net/`
- **Backend**: `https://alimanaka.chantilly-shaula.ts.net:8443/api`

## 📊 Data Source

Data is parsed from a structured Notion page using a custom extraction engine that handles Malagasy text, dates, and liturgical metadata.

---
*Developed with Hermes Agent.*

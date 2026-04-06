# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root (Docker)
- **Start all services**: `docker compose up -d --build`
- **Seed database**: `docker exec alimanaka-backend-new node seed.js`
- **Stop services**: `docker compose down`

### Backend (`/backend`)
- **Install dependencies**: `npm install`
- **Run server (Production)**: `npm start`
- **Run server (Development/Nodemon)**: `npm run dev`
- **Seed data manually**: `node seed.js`

### Frontend (`/frontend`)
- **Install dependencies**: `npm install`
- **Run development server**: `npm start`
- **Build for production**: `npm run build`
- **Run tests**: `npm test`
- **Run a single test**: `npm test -- <test-file-path>`

## Code Architecture & Structure

### Big Picture
This is a full-stack MERN (MongoDB, Express, React, Node.js) application dockerized for deployment. It serves as a liturgical calendar (Alimanaka) for the FLM church in 2026.

### Key Components
- **Backend (`/backend`)**:
  - `server.js`: Express entry point, registers middleware and routes.
  - `routes/`: Express router definitions with request validation.
  - `controllers/`: Business logic for API endpoints.
  - `middleware/`: Custom middleware including a central `errorHandler.js`.
  - `models/Event.js`: Mongoose schema for calendar events.
  - `seed.js`: Script to populate the database.
- **Frontend (`/frontend`)**:
  - `src/App.js`: Main React component using Material UI.
  - `src/services/api.js`: Centralized Axios API client.
  - Features: Auto-scroll to today/next available event, dynamic card colors based on liturgical seasons, and Tailscale HTTPS endpoint configuration.
- **Infrastructure**:
  - `docker-compose.yml`: Manages `alimanaka-frontend`, `alimanaka-backend`, and `mongodb` containers.
  - Frontend is mapped to port `8004`, Backend to port `8005`.
  - Configured for Tailscale HTTPS access.

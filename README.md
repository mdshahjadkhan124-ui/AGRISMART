# AgriSmart — Smart Crop Advisory System

A role-based agricultural advisory platform for the Indian market, built as a full-stack MERN application.

**No AI/ML anywhere.** Every feature that would normally sit behind a model — crop suggestion, fertilizer recommendation, disease diagnosis, the support chatbot — is either a deterministic, rule-based lookup or routed to a human expert for manual review. See [§ Rule-based advisory design](#rule-based-advisory-design) below.

For the phase-by-phase build log, demo credentials, and known issues, see [PROGRESS.md](./PROGRESS.md).

## Features

- **Farmer**: farm management, farm activity diary, rule-based soil health scoring, rule-based crop suggestion, rule-based fertilizer recommendation, manual-review disease reporting, expert consultation booking + chat, marketplace shopping, government scheme discovery, personal analytics
- **Agricultural Expert**: consultation queue, appointment chat and call scaffolding, disease report review queue, personal analytics
- **Marketplace Seller**: product listings, order fulfillment, personal analytics
- **Government Administrator**: scheme publishing and management, analytics
- **Super Administrator**: user management (search, role changes, activate/deactivate), audit log, platform-wide analytics
- **Agricultural Officer**: region-wide analytics (farmer/farm counts, disease report trends)
- **Platform-wide**: JWT auth with refresh-token rotation, RBAC on every route, real-time notifications and chat (Socket.IO), a rule-based Hindi/English FAQ chatbot

## Rule-based advisory design

| Feature | How it works (no model involved) |
|---|---|
| Crop suggestion | A static per-crop lookup table (N/P/K, temperature, humidity, pH, rainfall ranges) with a deterministic closeness score per parameter, averaged and ranked. |
| Fertilizer recommendation | N/P/K/pH classified into low/medium/high brackets (the same brackets used by the soil health scorer), mapped to a fixed fertilizer + dosage table. |
| Soil health score | The same N/P/K/pH brackets, averaged into a 0–100 score with a fixed label (Poor/Fair/Good/Excellent) and plain-language recommendations. |
| Disease reporting | A farmer uploads a photo + symptoms; it enters a queue; a human expert writes the diagnosis and treatment. No image classification. |
| FAQ chatbot | Keyword-overlap matching against a curated Hindi + English Q&A set. No LLM generation. |

## Tech stack

**Frontend** — React 19 + Vite + TypeScript, TailwindCSS v4 + shadcn/ui, Redux Toolkit (auth state) + TanStack Query (server state), React Router, React Hook Form + Zod, Axios, Recharts, Leaflet, Socket.IO client

**Backend** — Node.js + Express 5, MongoDB Atlas + Mongoose, JWT auth (rotating opaque refresh tokens), Socket.IO, Winston, Helmet/CORS/rate-limiting, Multer + Cloudinary, Swagger/OpenAPI, Node's built-in test runner + Supertest + mongodb-memory-server

## Project structure

```
Agrismart/
├── frontend/         React + TypeScript SPA (src/features, src/pages, src/routes, src/components)
├── backend/
│   ├── src/           config, routes, controllers, services, models, middleware, validators, utils, data, sockets
│   └── tests/          unit/ (rule-based engines) and integration/ (auth, RBAC, crop suggestion, disease flow)
├── docs/              project documentation
├── docker-compose.yml  local dev: frontend + backend + MongoDB
└── PROGRESS.md         phase-by-phase build log and demo credentials
```

## Getting started

### Prerequisites

- Node.js 20+
- A MongoDB Atlas cluster (or local MongoDB — see the Docker option below)

### Option A — run natively

**Backend**
```bash
cd backend
cp .env.example .env   # fill in your own values — see Environment variables below
npm install
npm run dev             # http://localhost:5000
npm run seed             # optional: creates one demo account per role
```

**Frontend** (separate terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

### Option B — Docker Compose

Brings up MongoDB, the backend, and the frontend together, using a local Mongo container instead of Atlas:

```bash
cp backend/.env.example backend/.env     # fill in JWT secrets at minimum
cp frontend/.env.example frontend/.env
docker compose up --build
```

Frontend: `http://localhost:5173` · Backend: `http://localhost:5000`

### Environment variables

Every third-party integration (Google OAuth, Twilio OTP, Cloudinary, OpenWeather) is **config-gated**: the app runs and boots fine without any of them configured, and the specific endpoints that need them return `501 Not Configured` with a message telling you which `.env` variable to set. Only `MONGO_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` are required to boot. See `backend/.env.example` and `frontend/.env.example` for the full list.

### Running tests

```bash
cd backend
npm test
```

Runs against a real, in-memory MongoDB (`mongodb-memory-server`) — no Atlas connection or network access required. Covers the auth flow, RBAC boundaries across all roles, the crop suggestion route, the disease report review flow end-to-end, and unit tests for every rule-based engine (soil health scorer, crop matcher, fertilizer recommender, FAQ chatbot).

### API documentation

Once the backend is running: Swagger UI at `http://localhost:5000/api/v1/docs`, health check at `http://localhost:5000/api/v1/health`.

## Documentation

See [PROGRESS.md](./PROGRESS.md) for phase-by-phase build status, demo credentials, and architectural decisions made along the way.

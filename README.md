# AgriSmart — Rule-Based Smart Crop Advisory System

A role-based agricultural advisory platform for the Indian market, built as a full-stack MERN application.

## About

AgriSmart connects Indian farmers with the tools and people they need to run a farm well: rule-based crop and fertilizer guidance, soil health scoring, a manual expert-review pipeline for crop diseases, live weather, a marketplace for seeds/tools/fertilizer, appointment booking with real-time chat, government scheme discovery, and a support chatbot — all behind role-based access control for six distinct user types (farmers, agricultural experts, agricultural officers, marketplace sellers, government administrators, and a super administrator). It's built for farmers first, with the surrounding roles representing the real stakeholders — experts, sellers, and government — that a working agricultural platform needs.

**No AI/ML anywhere.** Every feature that would normally sit behind a model — crop suggestion, fertilizer recommendation, disease diagnosis, the support chatbot — is either a deterministic, rule-based lookup or routed to a human expert for manual review. See [Rule-based advisory design](#rule-based-advisory-design) below for exactly how each one works.

## Live Demo

- **Frontend:** [https://agrismart-pink.vercel.app](https://agrismart-pink.vercel.app)
- **Backend API base:** `https://agrismart-5bng.onrender.com/api/v1`
- **API docs (Swagger):** `https://agrismart-5bng.onrender.com/api/v1/docs`

> ⚠️ The backend runs on Render's free tier, which spins down after inactivity. The **first** request after a period of idleness can take **30–60 seconds** to respond while the instance wakes up — this is expected, not a bug. Subsequent requests are fast.

## Demo Accounts

Every role shares the same password. Log in as any of these on the live demo (or your own local instance after seeding) to explore that role's exact permissions:

| Role | Email | Password |
|---|---|---|
| Farmer | `farmer.demo@agrismart.test` | `Passw0rd!123` |
| Agricultural Expert | `expert.demo@agrismart.test` | `Passw0rd!123` |
| Agricultural Officer | `officer.demo@agrismart.test` | `Passw0rd!123` |
| Marketplace Seller | `seller.demo@agrismart.test` | `Passw0rd!123` |
| Government Administrator | `govadmin.demo@agrismart.test` | `Passw0rd!123` |
| Super Administrator | `superadmin.demo@agrismart.test` | `Passw0rd!123` |

## Features

- **Farmer** — farm management, farm activity diary, rule-based soil health scoring, rule-based crop suggestion, rule-based fertilizer recommendation, manual-review disease reporting, expert consultation booking + real-time chat, marketplace shopping, government scheme discovery, personal analytics
- **Agricultural Expert** — expert profile management, disease report review queue (diagnosis + treatment), consultation queue, appointment chat, personal analytics
- **Marketplace Seller** — product listings (with photo upload), order fulfillment workflow, personal analytics
- **Government Administrator** — scheme publishing and management (create/update/delete), analytics
- **Super Administrator** — user management (search, role changes, activate/deactivate), audit log, disease report queue access, scheme management, platform-wide analytics
- **Agricultural Officer** — region-wide analytics only (total farmers, total farms, disease report trends). This role is intentionally minimal in the current build — there is no dedicated officer-only CRUD functionality beyond this monitoring view.
- **Platform-wide** — JWT auth with refresh-token rotation, Google Sign-In, RBAC enforced on every route, real-time notifications and chat (Socket.IO), a rule-based Hindi/English FAQ chatbot

## Rule-based advisory design

| Feature | How it works (no model involved) |
|---|---|
| Crop suggestion | A static per-crop lookup table (N/P/K, temperature, humidity, pH, rainfall ranges) with a deterministic closeness score per parameter, averaged and ranked. |
| Fertilizer recommendation | N/P/K/pH classified into low/medium/high brackets (the same brackets used by the soil health scorer), mapped to a fixed fertilizer + dosage table. |
| Soil health score | The same N/P/K/pH brackets, averaged into a 0–100 score with a fixed label (Poor/Fair/Good/Excellent) and plain-language recommendations. |
| Disease reporting | A farmer uploads a photo + symptoms; it enters a queue; a human expert writes the diagnosis and treatment. No image classification. |
| FAQ chatbot | Token-overlap keyword matching (with stop-word filtering and light stemming) against a curated Hindi/Hinglish + English Q&A set. No LLM generation. |

## User Roles

| Role | Purpose |
|---|---|
| Farmer | The primary user — manages farms, gets advisory guidance, reports problems, buys supplies, books experts |
| Agricultural Expert | Reviews disease reports and provides booked consultations to farmers |
| Agricultural Officer | Region-wide monitoring via aggregate analytics only |
| Marketplace Seller | Lists and fulfills agricultural products (seeds, tools, fertilizer) |
| Government Administrator | Publishes and manages official government schemes |
| Super Administrator | Platform owner — user management, audit log, and cross-cutting oversight |

## Tech Stack

**Frontend** — React 19, Vite, TypeScript, TailwindCSS v4 + shadcn/ui, Redux Toolkit (auth state), TanStack Query (server state), React Router, React Hook Form + Zod, Axios, Recharts, Leaflet + react-leaflet, Socket.IO client, `@react-oauth/google`

**Backend** — Node.js, Express 5, JavaScript (CommonJS), MongoDB Atlas + Mongoose, JWT auth with rotating opaque refresh tokens, Socket.IO, Winston logging, Helmet + CORS + rate limiting, Multer + Cloudinary (image uploads), Google Auth Library, Swagger/OpenAPI, Node's built-in test runner + Supertest + mongodb-memory-server

## Architecture

A standard three-tier setup:

```
React SPA (Vercel)  →  Express REST API + Socket.IO (Render)  →  MongoDB Atlas
```

- The frontend is a Vite-built single-page app calling a versioned REST API (`/api/v1`) over HTTPS, with a separate Socket.IO connection (authenticated via the same JWT) for real-time chat, notifications, and typing/presence indicators.
- The backend is a single Express service: routes → controllers → services → Mongoose models, with shared middleware for authentication, RBAC (`authorize(...roles)`), Zod validation, and centralized error handling.
- Every third-party integration (Google OAuth, Cloudinary, OpenWeather) is config-gated — the API boots and runs fine without them configured, and only the specific endpoints that need them return a clean `501 Not Configured` until you add the relevant key.
- Full interactive API documentation is auto-generated from JSDoc annotations on every route and served via Swagger UI at `/api/v1/docs`.

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or a local MongoDB instance)

### Clone

```bash
git clone https://github.com/mdshahjadkhan124-ui/AGRISMART.git
cd AGRISMART
```

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your own values
npm run dev             # http://localhost:5000
```

Backend environment variables (`backend/.env.example`) — only `MONGO_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` are required to boot; everything else is optional and config-gated:

```
NODE_ENV
PORT
CORS_ORIGIN
MONGO_URI
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_EXPIRY
JWT_REFRESH_EXPIRY
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
OPENWEATHER_API_KEY
FIREBASE_SERVER_KEY
```

### Seed demo data

```bash
npm run seed   # creates one demo account per role — see Demo Accounts above
```

Safe to re-run — it skips any account that already exists.

### Frontend (separate terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

Frontend environment variables (`frontend/.env.example`):

```
VITE_API_BASE_URL
VITE_SOCKET_URL
VITE_GOOGLE_CLIENT_ID
VITE_MAPS_TILE_URL
```

### Running tests

```bash
cd backend
npm test
```

Runs against a real, in-memory MongoDB (`mongodb-memory-server`) — no Atlas connection or network access required. Covers the auth flow, RBAC boundaries across all roles, the crop suggestion route, the disease report review flow end-to-end, and unit tests for every rule-based engine (soil health scorer, crop matcher, fertilizer recommender, FAQ chatbot).

### API documentation

Once the backend is running locally: Swagger UI at `http://localhost:5000/api/v1/docs`, health check at `http://localhost:5000/api/v1/health`.

## Deployment

- **Frontend** — deployed on [Vercel](https://vercel.com), built from the `frontend/` directory (`npm run build`, output `dist/`)
- **Backend** — deployed on [Render](https://render.com) as a Node web service, built from the `backend/` directory (`npm install` / `npm start`)
- **Database** — [MongoDB Atlas](https://www.mongodb.com/atlas), a managed cloud cluster shared by both local development and the deployed backend (via separate connection strings)

The two deployed services are wired together via environment variables: the frontend's `VITE_API_BASE_URL`/`VITE_SOCKET_URL` point at the Render backend, and the backend's `CORS_ORIGIN` is set to the exact Vercel origin so cross-origin requests and cookies are accepted.

## Screenshots

_Screenshots coming soon_

## Project structure

```
Agrismart/
├── frontend/         React + TypeScript SPA (src/features, src/pages, src/routes, src/components)
├── backend/
│   ├── src/           config, routes, controllers, services, models, middleware, validators, utils, data, sockets
│   └── tests/          unit/ (rule-based engines) and integration/ (auth, RBAC, crop suggestion, disease flow)
├── docs/              project documentation
└── PROGRESS.md         phase-by-phase build log and demo credentials
```

## Documentation

See [PROGRESS.md](./PROGRESS.md) for the phase-by-phase build log, demo credentials, and architectural decisions made along the way.

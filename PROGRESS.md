# AgriSmart — Progress

**No AI/ML anywhere in this project.** Everywhere an ML feature would normally sit, this app uses rule-based lookups or manual/expert review instead. See `README.md` for the stack overview.

## ⚠️ Known blocker (affects Phase 1 + Phase 2 verification)

The backend cannot reach MongoDB Atlas yet — `connect ETIMEDOUT`, because the current IP isn't allowlisted. Everything that doesn't touch the database has been verified (see below); anything DB-backed (health check's `"database": "connected"`, actual register/login/seed) is written and smoke-tested for wiring/logic but **not yet run against a live database**. Fix:

1. [MongoDB Atlas](https://cloud.mongodb.com) → your project → **Network Access**
2. **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
3. Tell the assistant once it's applied (~1 min) to re-verify

## Phase 1 — Scaffolding ✅

- [x] Monorepo layout: `/frontend`, `/backend`, `/docs`
- [x] Frontend: Vite + React 19 + TypeScript, TailwindCSS v4, shadcn/ui (Nova preset), React Router, Redux Toolkit, TanStack Query, React Hook Form + Zod, Axios, Recharts, Leaflet + react-leaflet, Socket.IO client, Framer Motion
- [x] Backend: Express app structure (`routes/`, `controllers/`, `models/`, `middleware/`, `services/`, `config/`, `sockets/`, `utils/`), Mongoose, JWT libs, Winston logging, Helmet, CORS, compression, rate limiting, Multer, Cloudinary, Socket.IO, Swagger/OpenAPI
- [x] `.env.example` for both apps; real `.env` files created locally (gitignored)
- [x] Health-check route: `GET /api/v1/health` (reports uptime + DB connection state)
- [x] Frontend dev server verified running
- [ ] Live Mongo connection verified — **blocked, see above**

## Phase 2 — Auth & RBAC ✅ (code complete, DB-backed testing pending)

**Backend**
- [x] `User` model (bcrypt-hashed password, 6-role enum, `local`/`google` auth providers)
- [x] `RefreshToken` model — stores only a SHA-256 hash of the token, tracks a rotation chain (`replacedByTokenHash`) so a reused/stolen refresh token revokes the whole token family
- [x] JWT access tokens (short-lived, `Authorization: Bearer`) + opaque refresh tokens (httpOnly cookie, scoped to `/api/v1/auth`, rotated on every use)
- [x] `authenticate` middleware (verifies access token) + `authorize(...roles)` middleware (RBAC)
- [x] Zod validation on every auth input (`validate` middleware)
- [x] Routes: `POST /auth/register` (always creates a `farmer` — a client can never self-assign a privileged role), `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- [x] Google OAuth (`POST /auth/google`) and OTP login (`POST /auth/otp/request`, `POST /auth/otp/verify`) — fully implemented, but return `501 Not Configured` until you add `GOOGLE_CLIENT_ID` / `TWILIO_*` to `backend/.env`
- [x] Dedicated rate limiter on all `/auth/*` routes (20 req / 15 min)
- [x] Seed script (`npm run seed`) creates one demo account per role
- [x] Smoke-tested: all routes wired correctly, validation/401/403/501/404 paths all verified without a live DB (see "How to test" below)
- [ ] Not yet exercised against a live database (register → login → refresh → logout round-trip) — pending Atlas fix

**Frontend**
- [x] `authSlice` (Redux Toolkit): `login`, `register`, `bootstrapSession` (silent refresh on app load via the httpOnly cookie), `logout`
- [x] Axios interceptors: attaches the access token to every request; on a `401`, transparently refreshes once and retries (concurrent 401s are coalesced into a single refresh call)
- [x] `ProtectedRoute` (redirects to `/login` if unauthenticated, `/unauthorized` if role doesn't match)
- [x] Pages: `/login`, `/register`, `/dashboard` (protected, shows role-aware welcome + logout), `/unauthorized`
- [x] Build verified (`tsc -b && vite build`), dev server verified serving all new routes

### How to run right now

**Backend**
```bash
cd backend
npm install
npm run dev    # http://localhost:5000
npm run seed   # once Atlas is reachable: creates 6 demo accounts
```

**Frontend**
```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

### How to test the backend right now (no live DB needed)

These confirm the routing/validation/RBAC logic works; they don't touch Mongo:
```bash
curl http://localhost:5000/api/v1/health
curl -X POST http://localhost:5000/api/v1/auth/login -H "Content-Type: application/json" -d "{}"
# -> 400 with Zod validation messages
curl http://localhost:5000/api/v1/auth/me
# -> 401 (no token)
```

### Demo credentials (once seeded)

All six use the same password for convenience — **demo/dev only, never use in production**:

| Role | Email | Password |
|---|---|---|
| Farmer | `farmer.demo@agrismart.test` | `Passw0rd!123` |
| Agricultural Expert | `expert.demo@agrismart.test` | `Passw0rd!123` |
| Agricultural Officer | `officer.demo@agrismart.test` | `Passw0rd!123` |
| Marketplace Seller | `seller.demo@agrismart.test` | `Passw0rd!123` |
| Government Administrator | `govadmin.demo@agrismart.test` | `Passw0rd!123` |
| Super Administrator | `superadmin.demo@agrismart.test` | `Passw0rd!123` |

Public registration (`/register` page) always creates a **farmer** account — the other five roles only exist via the seed script for now. Role management UI (promote/demote users) comes in Phase 6 (Super Admin panel).

### Notes / decisions made during Phase 1 + 2

- Tailwind v4 (`@tailwindcss/vite` plugin) + shadcn/ui "Nova" preset (Lucide icons, Geist font, neutral base color) — the newest shadcn CLI presets replace the old manual `tailwind.config.js` setup; theming lives in `frontend/src/index.css` as CSS variables. This registry has no bundled `Form` wrapper component, so auth forms use React Hook Form + Zod directly with plain `Input`/`Label`.
- `multer-storage-cloudinary` was deliberately **not** installed — it only supports Cloudinary SDK v1.x (which has a fixed high-severity vulnerability). Cloudinary uploads will instead use `multer.memoryStorage()` + `cloudinary.uploader.upload_stream()` directly in a service function when the upload feature is built (Phase 3/4).
- Refresh tokens are opaque random strings (not JWTs), stored only as a SHA-256 hash, with rotation + reuse detection — deliberately more defensible than a long-lived refresh JWT.
- Access token lives in memory (Redux store) only, never `localStorage` — mitigates XSS token theft. Session persistence across page reloads relies on the httpOnly refresh cookie + silent-refresh-on-load.
- Express 5 and Mongoose 9 were installed (latest majors as of scaffolding) — flagging in case any phase needs a syntax/behavior note versus older Express 4 / Mongoose 7 tutorials.

## Phase 3 — Core Farmer Features (not started)

## Phase 4 — Advisory Modules — rule-based (not started)

## Phase 5 — Expert, Marketplace & Government (not started)

## Phase 6 — Real-time & Admin (not started)

## Phase 7 — Polish (not started)

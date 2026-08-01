# AgriSmart — Progress

**No AI/ML anywhere in this project.** Everywhere an ML feature would normally sit, this app uses rule-based lookups or manual/expert review instead. See `README.md` for the stack overview.

## ⚠️ Known blocker (affects Phase 1–4 verification)

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

## Phase 3 — Core Farmer Features ✅ (code complete, DB-backed testing pending)

**Backend**
- [x] `FarmerProfile` model (1:1 with a farmer `User`) + `GET/PUT /farmers/me`
- [x] `Farm` model (name, area, soil type, irrigation type, optional lat/lng) with full CRUD under `/farms`, scoped to the logged-in farmer via a shared `getOwnedFarm` ownership check (404 if it doesn't exist, 403 if it's someone else's — reused by every farm-scoped resource below)
- [x] `CropHistory` model + `GET/POST /farms/:farmId/crop-history`
- [x] `SoilReport` model + `GET/POST /farms/:farmId/soil-reports`, `GET .../latest` — **rule-based soil health scorer** (`utils/soilHealthScore.js`): scores N/P/K against standard low/medium/high kg/ha brackets and pH against acid/neutral/alkaline bands, averages into a 0–100 score + Poor/Fair/Good/Excellent label, and generates plain-language fertilizer/lime recommendations. Deterministic, no ML — unit-verified with balanced/poor/partial inputs.
- [x] `FarmActivity` model (the farm diary: sowing/irrigation/fertilizing/spraying/weeding/harvesting/soil_testing/other) with full CRUD under `/farms/:farmId/activities`
- [x] `WeatherLog` model + OpenWeather integration (`services/weather.service.js`): `GET /weather/current` and `GET /weather/forecast`, gated behind `OPENWEATHER_API_KEY` (returns `501` until configured, same pattern as Google OAuth/OTP in Phase 2); every successful lookup is logged (best-effort) for history/analytics
- [x] Pagination (`page`/`limit` → `meta.total`/`totalPages`) on soil reports and activities lists
- [x] Found and fixed a real bug during smoke-testing: Express's `req.query` is a getter-only property — assigning to it silently no-ops. Query-string validation now stashes its parsed result on `req.validatedQuery` instead (see `middleware/validate.js`)
- [x] Smoke-tested: auth guarding, Zod validation, and the weather `501 Not Configured` gate all verified without a live DB
- [ ] Not yet exercised against a live database — pending Atlas fix

**Frontend**
- [x] `/profile` — farmer profile form (address/village/district/state/pincode/experience/bio)
- [x] `/farms` — list + create farm
- [x] `/farms/:farmId` — farm detail with a weather widget and three tabs: **Soil health** (latest score/label/recommendations + log-a-test form + history), **Crop history** (add/list past crops by season), **Activity diary** (log/list/delete farm activities)
- [x] All new data fetching uses TanStack Query (`features/farms`, `features/profile`, `features/weather`); Redux stays scoped to auth as originally intended
- [x] Added shadcn `select`, `textarea`, `tabs`, `badge` components (no new npm dependencies — already covered by the installed `radix-ui` meta-package)
- [x] Dashboard now links farmers to "My Farms" / "My Profile"; new routes are role-gated to `farmer` via `ProtectedRoute`
- [x] Fixed a real TypeScript issue: Zod v4's `z.coerce.number()` gives the parsed *output* type `number` but the raw *input* type `unknown`, which broke `useForm`'s single-generic inference on every form with a numeric field. Fixed by typing each form as `useForm<InputType, unknown, OutputType>` (RHF's 3-generic form) using `z.input<...>` / `z.output<...>` — a pattern that'll be needed again for any future form with coerced fields.
- [x] Build verified (`tsc -b && vite build`), dev server verified serving all new routes

### How to test the backend right now (no live DB needed)

```bash
curl http://localhost:5000/api/v1/farms
# -> 401 (no token)
curl -X POST http://localhost:5000/api/v1/weather/current
# -> 400 (missing lat/lon) or 401 without a token
```

### Notes / decisions made during Phase 3

- Soil nutrient brackets (N/P/K low/medium/high in kg/ha) follow the ranges used by India's Soil Health Card scheme — a real, citable rule-based standard, not an invented one.
- Ownership checks live in `farm.service.js`'s `getOwnedFarm` and are reused by crop history, soil reports, and activities — one place to audit for the "can a farmer see another farmer's data" question.
- Weather aggregation (3-hour OpenWeather steps → daily min/max/most-frequent-condition) is plain grouping/mode calculation, not forecasting — explicitly not ML.

## Phase 4 — Advisory Modules — rule-based ✅ (code complete, DB-backed testing pending)

**Backend**
- [x] **Crop suggestion** (`data/cropSuitability.js` + `utils/cropSuggestion.js`): a static lookup table of 16 common Indian field crops with ideal N/P/K/temperature/humidity/pH/rainfall ranges. Each crop gets a deterministic 0–100 score per parameter (100 inside range, linear falloff outside it), averaged and ranked — top 5 returned with season, water need, and static expected-yield/profit estimates. `POST/GET /crop-suggestions` (saves + lists history).
- [x] **Fertilizer recommendation** (`utils/fertilizerRecommendation.js`): reuses the exact same N/P/K brackets as the Phase 3 soil health scorer (exported as `NUTRIENT_BRACKETS`) so "low nitrogen" means the same thing everywhere, then maps each level to a real fertilizer + per-acre dosage (Urea/DAP-SSP/MOP) and pH to lime/gypsum dosage. `POST/GET /fertilizer-recommendations` — accepts either explicit N/P/K/pH or a `farmId`, in which case it pulls the farm's latest soil report automatically (explicit values always win if both are given).
- [x] **Disease reporting** (manual expert review, no CNN/classifier anywhere): `DiseaseReport` model with `pending → resolved` status. Farmer uploads a leaf photo (multipart) + crop + symptoms via `POST /disease-reports`; an expert sees it in `GET /disease-reports/queue` and answers with `PUT /disease-reports/:id/respond` (diagnosis + treatment), which resolves it. RBAC-separated: farmers can create/list/view their own reports, only experts (and super admins) can see the queue or respond.
- [x] Image uploads: `multer.memoryStorage()` (`middleware/upload.js`, 5MB limit, image-only filter) → `cloudinary.uploader.upload_stream()` (`services/imageUpload.service.js`), gated behind `CLOUDINARY_*` config the same way OAuth/OTP/weather are — returns `501` until configured. This is the pattern flagged as a to-do back in Phase 1.
- [x] Smoke-tested end-to-end including a real multipart upload (`FormData` + `fetch`) through multer → validation → the Cloudinary `501` gate, plus RBAC checks (expert blocked from creating reports, farmer blocked from the queue) — all without a live DB
- [ ] Not yet exercised against a live database — pending Atlas fix

**Frontend**
- [x] `/crop-suggestion` — soil/climate input form, ranked results with match % and out-of-range factors
- [x] `/fertilizer-recommendation` — optional farm picker (auto-fills from latest soil report) or manual N/P/K/pH entry, per-nutrient + pH amendment cards
- [x] `/disease-reports` (list + submit, multipart form via `FormData`) and `/disease-reports/:id` (farmer detail view — image, symptoms, and diagnosis/treatment once resolved)
- [x] `/expert/disease-queue` — new role-gated route (`allowedRoles={['expert', 'super_admin']}`) with an inline respond form per report
- [x] Dashboard now shows farmer advisory shortcuts and, for experts, a link to the review queue
- [x] Build verified (`tsc -b && vite build`), dev server verified serving all new routes

### Notes / decisions made during Phase 4

- Crop and fertilizer suggestions are persisted (`CropSuggestion`, `FertilizerRecommendation` collections) as a history, not just computed and thrown away — matches the DB design's "Advisory outputs" domain and lets a farmer look back at past recommendations.
- The disease queue intentionally has no separate "claim" step — whichever expert answers first resolves it. Coordination between multiple experts (assignment, in-progress locking) is a reasonable future addition but wasn't asked for and would add state complexity without a clear MVP need.
- Found and fixed a copy-paste bug while writing `fertilizerRecommendation.js`'s level classifier — caught immediately by the unit smoke test before it ever reached a route.

## Phase 5 — Expert, Marketplace & Government (not started)

## Phase 6 — Real-time & Admin (not started)

## Phase 7 — Polish (not started)

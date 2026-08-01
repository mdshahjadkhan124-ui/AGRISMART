# AgriSmart — Progress

**No AI/ML anywhere in this project.** Everywhere an ML feature would normally sit, this app uses rule-based lookups or manual/expert review instead. See `README.md` for the stack overview.

## ⚠️ Known blocker (Atlas specifically — DB logic itself is now tested)

The backend still cannot reach **MongoDB Atlas** — `connect ETIMEDOUT`, because the current IP isn't allowlisted. Fix:

1. [MongoDB Atlas](https://cloud.mongodb.com) → your project → **Network Access**
2. **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
3. Tell the assistant once it's applied (~1 min) to re-verify `npm run dev` + `npm run seed` against your real cluster

**This is narrower than it was through Phase 6.** Phase 7 added a real automated test suite that runs against an actual (in-memory, not mocked) MongoDB via `mongodb-memory-server` — so all the database-backed logic (registration, login, RBAC ownership checks, the crop suggestion and disease-report flows) **is now genuinely verified**, just not against your specific Atlas cluster. Running `npm test` in `backend/` doesn't require Atlas access at all. What Atlas access still gates: confirming your specific cluster/credentials work, and testing through the actual frontend against real persisted data.

**The test suite caught a real, previously-invisible bug**: `User.model.js`'s password-hashing `pre('save')` hook used the old callback-style signature (`async function(next) { ...; next(); }`), which modern Mongoose/Kareem no longer supports for `async` functions — it throws `TypeError: next is not a function`. This had been silently broken since Phase 2 and would have made **every single registration fail** the moment Atlas became reachable, because it was never exercised against a real database until Phase 7's tests ran. Fixed to the correct modern pattern (no `next` parameter, just `async`/`await`/return). This is exactly the kind of bug the Atlas blocker had been hiding across Phases 2–6's "code complete, DB-backed testing pending" notes.

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

## Phase 5 — Expert, Marketplace & Government ✅ (code complete, DB-backed testing pending)

**Backend**
- [x] **Expert directory**: `ExpertProfile` model (specialization, qualifications, experience, consultation fee, availability) with self-service `GET/PUT /experts/me`, plus a public `GET /experts` directory and `GET /experts/:id` detail — only experts who've filled out a profile are listed, which nudges completion.
- [x] **Appointment booking**: `Appointment` model (`pending → confirmed/rejected → completed`, plus `cancelled`) under `POST/GET /appointments`, `GET /appointments/:id`, `PUT /appointments/:id/status`. Status changes are governed by an explicit transition table (`ALLOWED_TRANSITIONS` in `appointment.service.js`) keyed by *which side of the appointment the caller is* — e.g. only the expert can confirm/reject a pending request, either side can cancel, only the expert can mark it completed. Ownership (`getOwnedAppointment`) means only the two participants can ever see or act on an appointment.
- [x] **Chat** (`ChatMessage` model, nested under `/appointments/:id/messages`): plain REST send/list scoped to the same two participants. This is intentionally REST-only for now — real-time delivery via Socket.IO is Phase 6 as originally planned; the frontend polls every 5s in the meantime.
- [x] **Video/audio call placeholder**: `GET /appointments/:id/call` returns a room id and a note that no provider (Twilio Video / Daily.co / Agora) is wired up yet — exactly the "scaffolding" the spec asked for, not a real call.
- [x] **Marketplace products**: `MarketplaceProduct` model with seller-owned CRUD (`POST/GET /marketplace/products/mine`, `PUT/DELETE /marketplace/products/:id`) plus a public browse/search/category-filter endpoint (`GET /marketplace/products`, text-indexed). Optional product photo reuses the same Cloudinary upload pattern as disease reports.
- [x] **Orders + simulated payments** (`Order` + `Payment` models — "functional-level," no real gateway): checkout (`POST /marketplace/orders`) validates every cart item belongs to the *same* seller (an order is single-seller by design, which keeps fulfillment ownership unambiguous), atomically reserves stock per item with rollback if a later item is unavailable, and creates a `Payment` record — `mock_online` is marked successful immediately, `cod` stays pending until the seller marks the order delivered. Seller fulfillment via `GET /marketplace/orders/seller` and `PUT /marketplace/orders/:id/status`; cancelling restores stock.
- [x] **Government schemes**: `GovernmentScheme` model, publicly browsable/searchable (`GET /schemes`, `GET /schemes/:id`), managed by any gov admin or super admin (`POST/PUT/DELETE /schemes/:id`) — schemes are a shared government resource, not personal data, so there's deliberately no per-creator ownership restriction on editing.
- [x] Smoke-tested: RBAC boundaries across all four roles (farmer/expert/seller/gov_admin) and every validation path, all without a live DB.
- [ ] Not yet exercised against a live database — pending Atlas fix

**Frontend**
- [x] `/experts` + `/experts/:id` (browse + book), `/expert/profile` (expert self-service), `/appointments` + `/appointments/:id` (role-aware list/detail, in-page chat panel, call placeholder panel, status action buttons that mirror the backend's transition rules)
- [x] `/marketplace` + `/marketplace/:id` (browse/search/filter + buy-now checkout), `/orders` + `/orders/:id` (farmer order history)
- [x] `/seller/products` (listing CRUD with optional photo upload) + `/seller/orders` (fulfillment actions)
- [x] `/schemes` + `/schemes/:id` (open to any authenticated role) + `/admin/schemes` (gov admin/super admin CRUD)
- [x] Dashboard now has role-specific shortcut sections for all six roles except Agricultural Officer (still pending a dedicated phase)
- [x] Build verified (`tsc -b && vite build`), dev server verified serving all 14 new routes

### Notes / decisions made during Phase 5

- An order is scoped to exactly one seller — checkout rejects a cart mixing products from two different sellers with a clear error, rather than trying to split/partially fulfill it. A buyer with a multi-seller cart simply places separate orders. This keeps `Order.seller` unambiguous for RBAC and avoids a much more complex multi-party fulfillment model that wasn't asked for.
- Chat is REST + 5s polling for now, not Socket.IO — deliberately deferred to Phase 6 ("Socket.IO notifications + chat") per the original phase plan, so the data layer (ownership-scoped `ChatMessage`) is ready for real-time delivery to be layered on top without a schema change.
- Appointment status transitions are enforced server-side via an explicit lookup table rather than scattered `if` checks — makes "who can do what from which state" auditable in one place (`appointment.service.js`).

## Phase 6 — Real-time & Admin ✅ (code complete, DB-backed testing pending)

**Backend**
- [x] **Socket.IO real-time layer** (`sockets/index.js`): every socket authenticates with the same JWT access token used for REST (`io.use` middleware), joins a personal `user:<id>` room, and can join an `appointment:<id>` chat room — ownership is re-checked server-side on every join, not just at REST-request time. Tracks online users in-memory (`Map<userId, Set<socketId>>`) for a lightweight presence check when a chat room is joined. Typing indicators broadcast to the room, excluding the sender.
- [x] **Notifications** (`Notification` model, `notification.service.js`): every notification is persisted first, then pushed over the socket if the recipient is connected — so it's never lost if they're offline, and appears live if they're online. Wired into every flow that has an obvious "someone should be told" moment: new appointment request, appointment status change, new chat message, disease report resolved, new order, order status change. `GET/PUT /notifications`.
- [x] **Live chat upgrade**: `chat.service.js` now emits over the socket (`chat:message`) in addition to persisting, so both participants see new messages instantly if connected; REST + a 15s poll remain the fallback.
- [x] **Video/audio call placeholder**: unchanged from Phase 5, still explicitly a scaffold.
- [x] **Rule-based FAQ chatbot** (`data/faq.js` + `utils/faqChatbot.js`): a curated ~10-entry Hindi+English Q&A set covering the app's main features; matching is pure keyword-overlap counting (most keyword hits wins, ties go to first entry) — **no LLM/AI generation anywhere**. `POST /chatbot/query`, unit-verified in both languages plus the no-match fallback.
- [x] **Role-specific analytics** (`analytics.service.js`): a single `GET /analytics/me` endpoint dispatches by the caller's role — farmer (farm/order/appointment counts, soil health trend, disease report status breakdown), expert (appointment status breakdown, reports resolved), seller (product count, order status breakdown, delivered revenue), officer (region-wide farmer/farm counts + disease report breakdown — a reasonable "regional oversight" lite view, since no phase ever scheduled the full disease-report map), gov admin (scheme counts by category), super admin (platform-wide: users by role, totals, revenue).
- [x] **Super Admin panel**: `AuditLog` model + `GET /admin/users` (search/filter), `PUT /admin/users/:id/role` (the role-elevation mechanism promised back in Phase 2 — public registration still only ever creates farmers), `PUT /admin/users/:id/status` (activate/deactivate), `GET /admin/audit-logs`. Role and status changes are audit-logged with before/after values; a user can't change their own role or deactivate themselves.
- [x] Smoke-tested: Socket.IO auth middleware (rejects bad tokens, accepts valid ones, verified with a real `socket.io-client` connection — added as a backend devDependency), chatbot matching in English and Hindi, admin RBAC boundaries, notification route auth-guarding — all without a live DB.
- [ ] Not yet exercised against a live database — pending Atlas fix

**Frontend**
- [x] `lib/socket.ts` — connects once per login (same access token as REST), disconnects on logout/session-expiry, wired into `authSlice`'s success/logout handlers
- [x] Global `NotificationBell` (unread badge, live-updating list via the socket) and `ChatbotWidget` (language toggle, floating panel) — both rendered from `App.tsx` whenever authenticated, not tied to any one page
- [x] Appointment chat now listens for `chat:message` over the socket (falls back to a 15s poll) and shows a "Typing…" indicator
- [x] `/analytics` — role-aware dashboard using Recharts (`CountBarChart`, `TrendLineChart`, `StatTile` — new reusable `components/common/` primitives), one view per role
- [x] `/admin/users` (role dropdown + activate/deactivate per user) and `/admin/audit-logs`, both super-admin only
- [x] Build verified (`tsc -b && vite build`), dev server verified serving all new routes

### Notes / decisions made during Phase 6

- A socket authenticates once at connect time and isn't re-validated as the JWT ages — acceptable here since access tokens are short-lived and sessions are naturally bounded, but a stricter production setup would want the client to reconnect on token refresh. Documented as a known simplification.
- Analytics charts use the app's `--primary` token rather than shadcn Nova's grayscale `--chart-1..5` variables — those are near-white/near-black and disappear against the app's light background; single-series bar/line charts only need one on-brand color since the category axis already carries identity.
- The Agricultural Officer role, unaddressed since Phase 1, now has *something* (a region-wide analytics view) — but the fuller "verifies farmer data, monitors disease reports on a map" description from the original role list was never scheduled in any phase's bullet points and remains a gap. Worth flagging explicitly rather than quietly leaving it unaddressed.
- Broader audit-log coverage (payments, other admin-adjacent actions) beyond role/status changes is a reasonable extension but wasn't literally asked for by "Super Admin panel (user management, audit logs)" — scoped to what was requested.

## Phase 7 — Polish ✅

- [x] **Swagger/OpenAPI docs**: all 51 endpoints across every route file annotated with JSDoc `@openapi` blocks (summary, tags, request bodies, responses, including the `501 Not Configured` gates and RBAC-relevant 403s). Live at `http://localhost:5000/api/v1/docs`, verified by both parsing the generated spec (51 paths found) and fetching the rendered Swagger UI page.
- [x] **Test suite** (`backend/tests/`, run via `npm test` → Node's built-in test runner, no extra framework needed): 15 unit tests for the four rule-based engines (soil health scorer, crop matcher, fertilizer recommender, FAQ chatbot — including a determinism check), plus 23 integration tests against a real in-memory MongoDB (`mongodb-memory-server`, no Atlas/network required) covering the full auth flow (register/login/refresh/logout, duplicate email, weak password, wrong password, missing/garbage tokens), RBAC boundaries (farmer vs. expert vs. seller vs. super admin, farm ownership, admin self-protection), the crop suggestion route, and the full disease-report review flow (queue → respond → resolved → visible to farmer, plus double-respond and cross-farmer-access rejection). **All 38 tests pass.**
  - Found and fixed a real, previously-invisible bug in the process: `User.model.js`'s password hashing hook used the old Mongoose callback pattern mixed with `async`, which throws `TypeError: next is not a function` on every actual save. This had been broken since Phase 2 and never caught because it only fires on a real DB write — which never happened until an in-memory Mongo was available to test against. See the blocker note above for the full story.
  - Auth rate limiting (20 req/15min) and the general API limiter (300 req/15min) are both relaxed under `NODE_ENV=test`, since the suite legitimately exceeds both.
- [x] **Root README.md**: expanded with a features-by-role list, the rule-based-design table (what replaces each would-be-ML feature and how), full tech stack, project structure, native setup instructions, environment variable notes, and test instructions.

### Notes / decisions made during Phase 7

- Chose Node's built-in `node --test` over Jest/Vitest — zero extra framework dependency, and Node 24 (this project's runtime) has a mature, stable test runner. `mongodb-memory-server` and `supertest` were the only test-only additions.
- The disease-report flow test seeds a `pending` report directly via the model rather than exercising the real multipart upload, since that would require live Cloudinary credentials; the upload → Cloudinary boundary itself was already smoke-tested manually in Phase 4. The test instead focuses on what's more valuable to regression-test: the queue → respond → resolved workflow and its RBAC/ownership boundaries.

## What's left / known gaps

- Live verification against your actual MongoDB Atlas cluster (blocked on Network Access — see above).
- The Agricultural Officer role has region-wide analytics but not the fuller "verify farmer data / disease report map" experience described in the original role list — never scheduled in any phase's bullet points (see Phase 6 notes).
- Frontend has no automated tests (backend only, per the spec's Phase 7 ask) and no code-splitting yet — Recharts/Leaflet push the main JS bundle over Vite's 500KB warning threshold.
- Broader audit-log coverage (payments, non-admin-panel sensitive actions) beyond role/status changes was scoped out as not literally requested.

# AgriSmart — Progress

**No AI/ML anywhere in this project.** Everywhere an ML feature would normally sit, this app uses rule-based lookups or manual/expert review instead. See `README.md` for the stack overview.

## Phase 1 — Scaffolding ✅ (mostly done, one item pending)

- [x] Monorepo layout: `/frontend`, `/backend`, `/docs`
- [x] Frontend: Vite + React 19 + TypeScript, TailwindCSS v4, shadcn/ui (Nova preset), React Router, Redux Toolkit, TanStack Query, React Hook Form + Zod, Axios, Recharts, Leaflet + react-leaflet, Socket.IO client, Framer Motion
- [x] Backend: Express app structure (`routes/`, `controllers/`, `models/`, `middleware/`, `services/`, `config/`, `sockets/`, `utils/`), Mongoose, JWT libs, Winston logging, Helmet, CORS, compression, rate limiting, Multer, Cloudinary, Socket.IO, Swagger/OpenAPI
- [x] `.env.example` for both apps; real `.env` files created locally (gitignored)
- [x] Health-check route: `GET /api/v1/health` (reports uptime + DB connection state)
- [x] Frontend dev server verified running (`npm run dev` → `http://localhost:5173`, HTTP 200)
- [ ] **Backend Mongo connection verified** — blocked on MongoDB Atlas Network Access: the configured IP isn't allowlisted yet. Once you add your IP (or `0.0.0.0/0` for dev) in Atlas → Network Access, tell me and I'll re-verify `npm run dev` boots and `/api/v1/health` reports `"database": "connected"`.

### How to run right now

**Backend**
```bash
cd backend
npm install   # already run once; re-run after pulling changes
npm run dev   # http://localhost:5000
```
`GET http://localhost:5000/api/v1/health` should return `{"success":true,"data":{"database":"connected",...}}` once Atlas access is fixed.

**Frontend**
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

### Demo credentials

None yet — seed accounts for all 6 roles are created in Phase 2 (Auth & RBAC).

### Notes / decisions made during scaffolding

- Tailwind v4 (`@tailwindcss/vite` plugin) + shadcn/ui "Nova" preset (Lucide icons, Geist font, neutral base color) — the newest shadcn CLI presets replace the old manual `tailwind.config.js` setup; theming lives in `frontend/src/index.css` as CSS variables.
- `multer-storage-cloudinary` was deliberately **not** installed — it only supports Cloudinary SDK v1.x (which has a fixed high-severity vulnerability). Cloudinary uploads will instead use `multer.memoryStorage()` + `cloudinary.uploader.upload_stream()` directly in a service function when the upload feature is built (Phase 3/4).
- Backend validation will use **Zod** (same library as the frontend) for a consistent validation mental model across the stack.
- Express 5 and Mongoose 9 were installed (latest majors as of scaffolding) — flagging in case any phase needs a syntax/behavior note versus older Express 4 / Mongoose 7 tutorials.

## Phase 2 — Auth & RBAC (not started)

- User model, register/login, JWT access + refresh rotation, RBAC middleware for all 6 roles, stub Google OAuth + OTP routes, seed demo user per role.

## Phase 3 — Core Farmer Features (not started)

## Phase 4 — Advisory Modules — rule-based (not started)

## Phase 5 — Expert, Marketplace & Government (not started)

## Phase 6 — Real-time & Admin (not started)

## Phase 7 — Polish (not started)

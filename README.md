# AgriSmart — Smart Crop Advisory System

A role-based agricultural advisory platform for the Indian market. Built as a full-stack MERN application with **rule-based** (not AI/ML) advisory logic throughout — see [PROGRESS.md](./PROGRESS.md) for the build plan and current status.

## Stack

- **Frontend**: React 19 + Vite + TypeScript, TailwindCSS + shadcn/ui, Redux Toolkit, TanStack Query, React Router, React Hook Form + Zod, Socket.IO client
- **Backend**: Node.js + Express, MongoDB Atlas + Mongoose, JWT auth, Socket.IO, Winston, Swagger

## Project structure

```
Agrismart/
├── frontend/   React + TypeScript SPA
├── backend/    Express REST API
└── docs/       Project documentation
```

## Getting started

### Prerequisites

- Node.js 20+
- A MongoDB Atlas cluster (or local MongoDB)

### Backend

```bash
cd backend
cp .env.example .env   # fill in your own values
npm install
npm run dev             # http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

### Health check

Once the backend is running: `GET http://localhost:5000/api/v1/health`

API docs (Swagger UI): `http://localhost:5000/api/v1/docs`

## Documentation

See [PROGRESS.md](./PROGRESS.md) for phase-by-phase build status, demo credentials, and what's next.

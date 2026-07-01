# Calculator Web App

A production-ready calculator with a **Node.js (Express) backend** and **React (Vite) frontend**, organized in separate folders.

## Project Structure

```
calculator/
├── backend/          # Express API (calculation engine, validation, security)
├── frontend/         # React SPA (calculator UI)
├── docker-compose.yml
└── package.json      # Root convenience scripts
```

## Features

- **Backend API**: Safe expression evaluation (mathjs), binary/unary operations, Zod validation
- **Security**: Helmet, CORS, rate limiting, input size limits
- **Frontend**: Modern responsive UI, keyboard shortcuts, calculation history
- **Production**: Docker images, Nginx reverse proxy, health checks, graceful shutdown

## Quick Start (Development)

### Prerequisites

- Node.js 18+

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure backend

```bash
cp backend/.env.example backend/.env
```

### 3. Run both services

**Terminal 1 — Backend:**
```bash
npm run dev:backend
```

**Terminal 2 — Frontend:**
```bash
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173). The Vite dev server proxies `/api` to the backend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calculator/health` | Health check |
| GET | `/api/calculator/operations` | Supported operations |
| POST | `/api/calculator/evaluate` | Evaluate expression `{ "expression": "2+3*4" }` |
| POST | `/api/calculator/binary` | Binary op `{ "operation": "add", "a": 2, "b": 3 }` |
| POST | `/api/calculator/unary` | Unary op `{ "operation": "sqrt", "value": 16 }` |

## Production (Docker)

```bash
docker compose up --build -d
```

- Frontend: [http://localhost](http://localhost)
- Backend API: [http://localhost:3001](http://localhost:3001)

## Testing

```bash
npm run test:backend
```

## Keyboard Shortcuts

- `0-9`, `.` — Input digits
- `+`, `-`, `*`, `/` — Operators
- `Enter` or `=` — Calculate
- `Backspace` — Delete last character
- `Esc` — Clear

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, mathjs, Zod |
| Frontend | React 18, Vite 6 |
| DevOps | Docker, Nginx, docker-compose |

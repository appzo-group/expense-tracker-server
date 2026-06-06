# Expense Tracker — Backend

Node.js + Express + MongoDB API following a **module-based architecture**. See
`../.instructions/blueprint/backend.md` for the full design (the source of truth).

## Stack

TypeScript · Express · Mongoose · JWT (access + rotating refresh tokens) ·
bcryptjs · express-validator · helmet · cors · express-rate-limit · winston ·
Jest + supertest + mongodb-memory-server.

## Getting started

```bash
cd server
cp .env.example .env        # then edit secrets
npm install
npm run dev                 # tsx watch, http://localhost:3000
```

Requires a running MongoDB (`MONGO_URI`). Tests use an in-memory Mongo, so no
local database is needed for `npm test`.

## Scripts

| Script              | Purpose |
|---------------------|---------|
| `npm run dev`       | Watch-mode dev server (`tsx`). |
| `npm run build`     | Compile TypeScript to `dist/`. |
| `npm start`         | Run the compiled server. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm test`          | Jest against in-memory Mongo. |

## Architecture

```
src/
├── core/        config (env/db/logger), http (ApiError/ApiResponse/catchAsync), middleware
├── shared/      constants, types, utils (pagination, password, sanitize)
├── modules/     auth · tokens · users · transactions · expenses · income · budgets · analytics
├── routes.ts    mounts every module router under /api
├── app.ts       express assembly (no listen)
└── server.ts    bootstrap: validate env → connect db → listen
```

Each module owns its routes/controller/service/(repository/model)/validation/types/
tests and exposes a single `index.ts` public API. Modules talk only through those
public APIs (e.g. `budgets` and `analytics` import `transactionService`).
`expenses` and `income` are thin wrappers over the shared `Transaction`.

## Conventions

- **Request flow:** `router → rateLimit → auth → validation → validate → controller → service → repository`.
- **Responses:** success → `ApiResponse` (`{ success, message, data, meta }`);
  errors → `ApiError` via the central error middleware (`{ success, message, errors }`).
- **Validation:** failures return `422` with a `field → message` map.
- **Auth:** every route except `/api/auth/*` requires `Authorization: Bearer <accessToken>`.
- **Scoping:** every query is filtered by the authenticated user — no cross-user access.

## API surface (under `/api`)

`auth` (register/login/logout/refresh/forgot-password/reset-password) ·
`users` (profile, settings) · `transactions` (list, get) ·
`expenses` & `income` (CRUD) · `budgets` (CRUD, computed `spent`) ·
`analytics` (by-category, monthly, weekly, income-vs-expense, insights) ·
`dashboard/summary`.

Import `postman_collection.json` for ready-to-run requests (Login/Register save the
tokens automatically).

> Note: the blueprint specifies `bcrypt`; this implementation uses **`bcryptjs`**
> (same algorithm, pure-JS, no native build) for portable installs and tests.
# expense-tracker-server

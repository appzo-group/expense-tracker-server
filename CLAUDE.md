# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # tsx watch-mode dev server on :3000
npm run typecheck    # tsc --noEmit (run before any commit)
npm test             # Jest against in-memory MongoDB (no local DB needed)
npm run build        # compile to dist/
npm start            # run dist/server.js
```

Run a single test file:
```bash
npm test -- --testPathPattern=auth
npm test -- --testPathPattern=budget
```

Tests use `mongodb-memory-server` — first run downloads the binary and may take a moment.

## Architecture

```
src/
├── app/
│   ├── modules/     # feature modules (see below)
│   ├── middlewares/ # auth, validateRequest, globalErrorHandler, rateLimit, sanitize
│   ├── errors/      # ApiError class + Zod/Mongoose error formatters
│   └── routes/      # mounts all module routers under /api/v1
├── config/          # env vars via dotenv → single default export
├── enums/           # TransactionType, BudgetPeriod (as const arrays + types)
├── helpers/         # jwtHelper, passwordHelper, pagination, requireUser
├── shared/          # catchAsync, sendResponse, logger, softDelete.plugin
├── types/           # IPaginated, IMeta, IErrorMessage
├── app.ts           # Express assembly (no listen)
└── server.ts        # bootstrap: connect DB → listen
```

**Modules:** `auth · tokens · users · transactions · expenses · income · budgets · analytics`

- `expenses` and `income` are thin wrappers over `TransactionService` — they have no model or repository of their own, just inject `type: 'expense'` or `type: 'income'`.
- `analytics` and `dashboard` are read-only compositions of `TransactionService` + `BudgetService`.
- `tokens` is an internal service (JWT sign/verify + refresh-token rotation). It has no HTTP routes.
- Modules communicate only through their `index.ts` public API.

## Module file conventions

Every module has this exact file set (adapting logic, not structure):

```
xxx.interface.ts   xxx.model.ts   xxx.repository.ts
xxx.service.ts     xxx.controller.ts   xxx.validation.ts
xxx.routes.ts      index.ts
```

### interface.ts
Plain data shape + `HydratedDocument` type alias. **Never** `extends Document` here.

```ts
export interface TransactionInterface { userId: Types.ObjectId; amount: number; ... }
export type ITransaction = HydratedDocument<TransactionInterface>;
export interface ICreateTransaction { ... }   // input DTOs
export interface IPublicTransaction { ... }   // response shape
```

### model.ts
Uses `Schema<IXxx>` and `model<IXxx>()`. The document interface lives in the interface file, not here.

```ts
const transactionSchema = new Schema<ITransaction>({ ... }, { timestamps: true });
transactionSchema.plugin(softDeletePlugin);   // adds deletedAt + auto-excludes deleted docs
export const TransactionModel = model<ITransaction>('Transaction', transactionSchema);
```

### repository.ts
One individual named export per query. No object grouping. No explicit return types.

```ts
export const findTransactionById = (userId: string, id: string) =>
  TransactionModel.findOne({ _id: id, userId: new Types.ObjectId(userId) });
```

### service.ts
Individual named exports. Throws `ApiError(statusCode, message)` for domain errors. Uses `(doc: any)` for `toPublic` cast.

```ts
export const toPublic = (doc: any): IPublicTransaction => doc

export const getSingleTransactionFromDB = async (userId: string, id: string) => {
  const doc = await findTransactionById(userId, id);
  if (!doc) throw new ApiError(404, 'Transaction not found');
  return toPublic(doc);
};
```

### controller.ts
Plain `async (req, res): Promise<void>` functions — **no `catchAsync` inside**. `catchAsync` is applied in the routes file.

```ts
export const getSingleTransaction = async (req: Request, res: Response): Promise<void> => {
  const result = await getSingleTransactionFromDB(requireUserId(req), req.params.id);
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: '...', data: result });
};
```

### validation.ts
Individual `const` schema declarations + `export { ... }` block at the bottom. Always wraps in `z.object({ body: z.object({...}) })`.

```ts
const createTransactionZodSchema = z.object({ body: z.object({ ... }) });
const idParamZodSchema = z.object({ params: z.object({ id: z.string().regex(...) }) });

export { createTransactionZodSchema, idParamZodSchema };
```

### routes.ts
`catchAsync` applied here. Individual named imports from controller and validation.

```ts
import catchAsync from '../../../shared/catchAsync';
import { getSingleTransaction } from './transaction.controller';
import { idParamZodSchema } from './transaction.validation';

router.use(auth());
router.get('/:id', validateRequest(idParamZodSchema), catchAsync(getSingleTransaction));
```

### index.ts
Minimal — re-exports router + types/functions needed by other modules only.

## Response shapes

Success:
```json
{ "success": true, "message": "...", "data": {...}, "meta": {...} }
```

Error (from `globalErrorHandler`):
```json
{ "success": false, "statusCode": 422, "message": "...", "errorMessages": [{ "path": "field", "message": "..." }] }
```

Validation failures → `422`. Auth failures → `401`. Not found → `404`. Conflicts → `409`.

## Key shared utilities

| Utility | Location | Purpose |
|---|---|---|
| `catchAsync` | `shared/catchAsync.ts` | Wraps async route handlers, forwards errors to `next` |
| `sendResponse` | `shared/sendResponse.ts` | Typed `res.status().json()` wrapper |
| `requireUserId` | `helpers/requireUser.ts` | Extracts `req.user.id`, throws `401` if missing |
| `validateRequest` | `middlewares/validateRequest.ts` | Zod schema middleware (`body`, `query`, `params`) |
| `softDeletePlugin` | `shared/softDelete.plugin.ts` | Adds `deletedAt` field; pre-hooks auto-exclude deleted docs from all queries |
| `ApiError` | `app/errors/ApiErrors.ts` | `new ApiError(statusCode, message)` — picked up by global handler |

## Soft delete

All owned data (transactions, budgets) uses `softDeletePlugin`. Set `deletedAt: new Date()` to soft-delete — the plugin's pre-hooks exclude these documents automatically. Hard-delete is never used for user data.

## Auth flow

- `POST /api/v1/auth/register` and `/login` return `{ accessToken, refreshToken, user }`.
- All other routes require `Authorization: Bearer <accessToken>`.
- Refresh tokens are stored hashed in MongoDB with a TTL index for automatic expiry.
- Rotation: `/auth/refresh` revokes the old token and issues a new pair.

## Tests

- Integration tests only — no mocked services or repositories.
- Test state is built through real HTTP calls (`supertest`).
- `tests/helpers/setup.ts` spins up `MongoMemoryServer`, connects Mongoose, and wipes all collections after each test.
- Test files live alongside their module: `xxx.test.ts` in the module folder.

# ztnet-tools-ui

[![CI](https://github.com/shizobot/ztnet-tools-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/shizobot/ztnet-tools-ui/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/shizobot/ztnet-tools-ui/branch/main/graph/badge.svg)](https://codecov.io/gh/shizobot/ztnet-tools-ui)

Standalone frontend UI for managing ZeroTier controller data.

## Migration status

The project is in an **active migration** from the single-file legacy HTML UI to modular React + TypeScript.

- ✅ **Ready now**: Vite + React + TypeScript app shell, routing, Zustand store, API wrapper, CSS split into modular files, panel scaffolds, and test/lint/typecheck/build scripts are in place.
- 🔄 **In progress**: strict feature-parity validation against legacy behavior (edge-case interactions, content parity checks, and incremental UX polish while preserving original logic).
- 📌 **Current expectation**: the new frontend is usable for core flows, but migration hardening is still underway and should be treated as not fully finalized.

## Prerequisites

- Node.js 20+
- npm 10+
- Running backend API endpoint (default expected at `http://localhost:3001`)

## Dev setup

```bash
npm install
npm run dev
```

The Vite dev server starts locally and proxies API calls using `VITE_BACKEND_URL`.

## Dependency version alignment rule

- Keep **runtime and typings major versions aligned**.
- Current aligned React line in this repository: `react@^18.3.1`, `react-dom@^18.3.1`, `@types/react@^18.3.28`, `@types/react-dom@^18.3.7`.
- CI enforces this through `npm run check:deps-align` (script: `scripts/check-react-types-alignment.mjs`).

## Build

```bash
npm run build
npm run preview
```

- `npm run build` compiles TypeScript and builds production assets in `dist/`
- `npm run preview` serves the built bundle for local verification

## Env vars

| Variable            | Default                 | Description                                                             |
| ------------------- | ----------------------- | ----------------------------------------------------------------------- |
| `VITE_BACKEND_URL`  | `http://localhost:3001` | Vite dev-server proxy target for requests to `/api`.                    |
| `VITE_API_BASE_URL` | `/api`                  | Optional runtime override for API base URL used by the frontend client. |

## API transport strategy (`/api`, proxy, CORS)

Frontend API calls are centralized in `src/api/ztApi.ts` and now resolve to a single base URL.

- **Default mode (recommended):** relative `/api` base.
  - Browser calls look like `/api/status`, `/api/controller/network`, etc.
  - In development, Vite proxies `/api` to `VITE_BACKEND_URL`.
  - In production, your reverse proxy (Nginx/Caddy/Traefik) should route `/api` to the backend service.
- **Optional override:** set `VITE_API_BASE_URL` for a fully qualified API URL if a direct upstream is required.

### Dev flow

1. Start backend at `http://localhost:3001` (or your own target).
2. Run frontend with `npm run dev`.
3. Vite forwards any request under `/api` to `VITE_BACKEND_URL`.

This avoids browser CORS issues in local dev because requests are same-origin to Vite.

### Prod flow

Deploy static frontend behind a reverse proxy and keep API traffic under the same origin:

- `https://your-app.example/*` → frontend static assets
- `https://your-app.example/api/*` → backend service

If you keep same-origin routing via reverse proxy, CORS can remain disabled or highly restrictive. If frontend and backend are on different origins, configure backend CORS explicitly to allow the frontend origin and required headers (`X-ZT1-AUTH`, `Authorization`, `Content-Type`).

## Test run

```bash
npm run lint
npm run typecheck
npm run test
npm run test:coverage
```

- `npm run lint` runs ESLint + Prettier checks.
- `npm run typecheck` runs TypeScript checks without emitting files.
- `npm run test` runs Vitest once.
- `npm run test:coverage` runs Vitest with coverage reporting (used by CI/Codecov).

## Panel/route migration matrix

| Route                   | Panel                | Status      | Notes                                                                 |
| ----------------------- | -------------------- | ----------- | --------------------------------------------------------------------- |
| `/`                     | `DashboardPanel`     | Implemented | Wired in router and available in current app shell.                   |
| `/status`               | `StatusPanel`        | Implemented | Wired in router and available in current app shell.                   |
| `/networks`             | `NetworksPanel`      | Implemented | Wired in router and available in current app shell.                   |
| `/networks/create`      | `CreateNetworkPanel` | Implemented | Wired in router and available in current app shell.                   |
| `/networks/:nwid`       | `NetworkConfigPanel` | Implemented | Wired in router and available in current app shell.                   |
| `/members`              | `MembersPanel`       | Implemented | Wired in router and available in current app shell.                   |
| `/members/:nwid/:id`    | `MemberDetailPanel`  | Implemented | Wired in router and available in current app shell.                   |
| `/api`                  | `RawApiPanel`        | Implemented | Wired in router and available in current app shell.                   |
| `/curl`                 | `CurlBuilderPanel`   | Implemented | Wired in router and available in current app shell.                   |
| `/settings`             | `SettingsPanel`      | Implemented | Wired in router and available in current app shell.                   |
| Additional parity tasks | N/A                  | Planned     | Ongoing migration hardening for full legacy parity and UX edge cases. |

## Architecture (high level)

```text
src/
├─ store/       # global Zustand state (host, token, networks, members, etc.)
├─ hooks/       # app logic orchestration (connection, networks, members, config)
├─ api/         # typed fetch wrappers to ZeroTier controller endpoints
├─ components/  # shared UI + layout primitives
└─ panels/      # route-level screens (dashboard, networks, members, settings)
```

## Secret storage policy & threat model

### Current policy

- `host` may be persisted in `localStorage` to improve reconnect UX.
- `token` is **ephemeral by default** and is kept in in-memory Zustand state for the current tab session only.
- Persisting token to `localStorage` is opt-in via **"Remember token on this device"** in Settings.
- For higher-security deployments, prefer short-lived backend-issued session credentials (HttpOnly/Secure cookies) and avoid long-lived controller tokens in browsers.

### Threat model (frontend-focused)

- If an attacker achieves XSS in this app, they can execute JavaScript in the same origin and access runtime state.
- In ephemeral mode, token exposure window is reduced to active tab lifetime.
- In persisted mode, XSS impact increases because attacker code can read long-lived token from `localStorage`.
- XSS can also perform authenticated actions directly while the page is open, even without persistent token storage.

### Mitigations and recommendations

- Keep token persistence disabled unless absolutely required.
- Use strict Content Security Policy, dependency hygiene, and regular security scanning to reduce XSS risk.
- Prefer backend session mediation with short TTL + rotation, HttpOnly/Secure cookies, and server-side token vaulting for production environments.
- Rotate ZeroTier controller tokens immediately after suspected compromise.

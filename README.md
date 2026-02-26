# ztnet-tools-ui

[![CI](https://github.com/shizobot/ztnet-tools-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/shizobot/ztnet-tools-ui/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/shizobot/ztnet-tools-ui/branch/main/graph/badge.svg)](https://codecov.io/gh/shizobot/ztnet-tools-ui)

Standalone frontend UI for managing ZeroTier controller data.

## Prerequisites

- Node.js 20+
- npm 10+
- Running backend API endpoint (default expected at `http://localhost:3001`)

## Dev setup

```bash
npm install
npm run dev
```

The Vite dev server will start locally and proxy API calls using `VITE_BACKEND_URL`.

## Build

```bash
npm run build
npm run preview
```

- `npm run build` creates production assets in `dist/`
- `npm run preview` serves the built bundle for local verification

## Env vars

| Variable | Default | Description |
|---|---|---|
| `VITE_BACKEND_URL` | `http://localhost:3001` | Base backend target used by frontend API proxy/integration. |

## Test run

```bash
npm run test
npm run test:coverage
```

Use the coverage command in CI to upload reports to Codecov.

## Architecture (high level)

```text
src/
├─ store/       # global Zustand state (host, token, networks, members, etc.)
├─ hooks/       # app logic orchestration (connection, networks, members, config)
├─ api/         # typed fetch wrappers to ZeroTier controller endpoints
├─ components/  # shared UI + layout primitives
└─ panels/      # route-level screens (dashboard, networks, members, settings)
```

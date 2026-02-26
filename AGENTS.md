# Codex Task — FRONTEND: ztnet-tools-ui

## Source
https://raw.githubusercontent.com/CleoWixom/webui-ztnetools/refs/heads/main/ztnet-tools-v2.html

---

## Your Job

Fetch the HTML above, fully parse it, extract every piece of markup, style and
client-side logic, then scaffold a production-grade standalone frontend repository.
Do NOT rewrite business logic — extract it exactly, then reorganise into proper modules.

---

## Target Repository Structure
```
ztnet-tools-ui/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               # runs on every push + PR to main/develop
│   │   ├── release.yml          # runs on push to main after CI passes
│   │   ├── codeql.yml           # GitHub CodeQL security analysis
│   │   └── dependency-review.yml # blocks PRs that introduce vulnerable deps
│   │
│   ├── CODEOWNERS               # * @yourorg/frontend-team
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── .husky/
│   ├── pre-commit               # lint-staged
│   └── commit-msg               # commitlint (conventional commits)
│
├── .vscode/
│   ├── extensions.json          # recommended: ESLint, Prettier, Tailwind (none here)
│   └── settings.json            # formatOnSave, ESLint validate
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx               # React Router v6 route definitions
│   │
│   ├── styles/
│   │   ├── tokens.css           # :root CSS variables (--bg, --accent, --border …)
│   │   ├── base.css             # reset, body, grid bg, scrollbars
│   │   ├── layout.css           # header, aside#sidebar, main, .app-body
│   │   ├── components.css       # cards, badges, buttons, toggles, tables,
│   │   │                        # toasts, terminals, route-rows, ip-tags, notices
│   │   └── panels.css           # .panel animations, .page-hdr, .cfg-section
│   │
│   ├── store/
│   │   └── appStore.ts          # Zustand — mirrors const S = {...} from HTML
│   │                            # host, token, nodeId, connected, networks,
│   │                            # selectedNwid, memberIps, pools, routes,
│   │                            # v6pools, v6routes, dnsServers, dnsDomain
│   │
│   ├── api/
│   │   └── ztApi.ts             # fetch() wrapper → ZeroTier Controller API
│   │                            # ztGet / ztPost / ztDelete
│   │
│   ├── hooks/
│   │   ├── useConnection.ts     # testConnection(), savePrefs(), loadPrefs()
│   │   ├── useNetworks.ts       # loadNetworksData(), filterNetworks()
│   │   ├── useMembers.ts        # loadMembers(), loadMemberDetail(), saveMember()
│   │   └── useNetworkConfig.ts  # loadNetworkConfig(), saveNetworkConfig(), deleteNetwork()
│   │
│   ├── lib/
│   │   └── clipboard.ts         # copyText(), copyEl()
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Fab.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Toggle.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Notice.tsx
│   │   │   ├── RouteRow.tsx
│   │   │   ├── DnsServerRow.tsx
│   │   │   ├── IpTag.tsx
│   │   │   ├── TagBox.tsx
│   │   │   ├── Terminal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── TabBar.tsx
│   │   │   ├── IpRangeGrid.tsx
│   │   │   ├── TunnelBlock.tsx
│   │   │   ├── NetworkPicker.tsx
│   │   │   ├── AccessRadioGroup.tsx
│   │   │   └── AddSubCard.tsx
│   │   │
│   │   └── panels/
│   │       ├── DashboardPanel.tsx
│   │       ├── StatusPanel.tsx
│   │       ├── NetworksPanel.tsx
│   │       ├── CreateNetworkPanel.tsx
│   │       ├── NetworkConfigPanel.tsx
│   │       ├── MembersPanel.tsx
│   │       ├── MemberDetailPanel.tsx
│   │       ├── RawApiPanel.tsx
│   │       ├── CurlBuilderPanel.tsx
│   │       └── SettingsPanel.tsx
│   │
│   ├── constants/
│   │   ├── easyRanges.ts        # EASY_RANGES array (20 predefined IPv4 ranges)
│   │   └── curlTemplates.ts     # curlTpls object (8 curl command templates)
│   │
│   └── __tests__/
│       ├── unit/
│       │   ├── routeTag.test.ts          # routeTag() LAN/default/public logic
│       │   ├── easyRanges.test.ts        # EASY_RANGES structure integrity
│       │   ├── clipboard.test.ts         # copyText mock test
│       │   └── store/
│       │       └── appStore.test.ts      # Zustand store actions
│       │
│       ├── components/
│       │   ├── Toggle.test.tsx
│       │   ├── Badge.test.tsx
│       │   ├── RouteRow.test.tsx
│       │   ├── AccessRadioGroup.test.tsx
│       │   ├── NetworkPicker.test.tsx
│       │   └── Toast.test.tsx
│       │
│       └── panels/
│           ├── DashboardPanel.test.tsx
│           ├── CreateNetworkPanel.test.tsx
│           └── NetworkConfigPanel.test.tsx
│
├── index.html
├── vite.config.ts               # proxy /api → VITE_BACKEND_URL (default http://localhost:3001)
├── tsconfig.json                # strict: true
├── tsconfig.node.json
├── vitest.config.ts             # jsdom env, coverage via v8
├── .eslintrc.cjs                # @typescript-eslint, react-hooks, jsx-a11y
├── .prettierrc
├── .commitlintrc.cjs            # conventional commits
├── lint-staged.config.cjs
├── package.json
├── CHANGELOG.md                 # auto-generated by semantic-release
├── LICENSE
└── README.md
```

---

## GitHub Actions Workflows

### `.github/workflows/ci.yml`
Trigger: `push` and `pull_request` → branches `main`, `develop`
```yaml
jobs:
  lint:
    - actions/checkout
    - actions/setup-node@v4 (node 20, cache: npm)
    - npm ci
    - npx eslint . --max-warnings 0
    - npx prettier --check .

  typecheck:
    - npm ci
    - npx tsc --noEmit

  test:
    - npm ci
    - npx vitest run --coverage
    - upload coverage to Codecov (codecov/codecov-action@v4)

  build:
    needs: [lint, typecheck, test]
    - npm ci
    - npm run build
    - upload dist/ as artifact (actions/upload-artifact)

  size-check:
    needs: build
    - download artifact
    - bundlesize check: main bundle < 400 kB gzip
      (use bundlesize2 or custom du -sh dist/assets/*.js)
```

### `.github/workflows/release.yml`
Trigger: `push` to `main` (only after ci.yml succeeds, using `workflow_run`)
```yaml
jobs:
  release:
    - actions/checkout (fetch-depth: 0, persist-credentials: false)
    - actions/setup-node@v4
    - npm ci
    - npx semantic-release
      # plugins in order:
      #   @semantic-release/commit-analyzer    (conventional commits → version bump)
      #   @semantic-release/release-notes-generator
      #   @semantic-release/changelog          (writes CHANGELOG.md)
      #   @semantic-release/npm               (updates package.json version, no publish)
      #   @semantic-release/git               (commits CHANGELOG.md + package.json)
      #   @semantic-release/github            (creates GitHub Release + tag)
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

`.releaserc.json`:
```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", { "changelogFile": "CHANGELOG.md" }],
    ["@semantic-release/npm", { "npmPublish": false }],
    ["@semantic-release/git", { "assets": ["CHANGELOG.md", "package.json"] }],
    "@semantic-release/github"
  ]
}
```

### `.github/workflows/codeql.yml`
Trigger: `push` to `main`, `pull_request` to `main`, `schedule` (weekly Monday 08:00 UTC)
```yaml
jobs:
  analyze:
    language: javascript-typescript
    - actions/checkout
    - github/codeql-action/init (languages: javascript-typescript)
    - github/codeql-action/autobuild
    - github/codeql-action/analyze
      (category: /language:javascript-typescript)
```

### `.github/workflows/dependency-review.yml`
Trigger: `pull_request`
```yaml
jobs:
  dependency-review:
    - actions/checkout
    - actions/dependency-review-action@v4
      fail-on-severity: moderate
      deny-licenses: GPL-2.0, AGPL-3.0
```

---

## Parsing Rules (same as monorepo spec)

1. `:root` CSS vars → `tokens.css`; body/html/overlays → `base.css`;
   header/aside/main → `layout.css`; components → `components.css`;
   panels → `panels.css`

2. Each `<div class="panel" id="panel-*">` → dedicated React component in `panels/`

3. JS extraction map:
```
   const S         → appStore.ts (Zustand)
   const N         → CreateNetworkPanel local useState
   const v6State   → NetworkConfigPanel local useState
   EASY_RANGES     → constants/easyRanges.ts
   curlTpls        → constants/curlTemplates.ts
   api()           → api/ztApi.ts
   navigate()      → React Router useNavigate()
   savePrefs/loadPrefs / testConnection → hooks/useConnection.ts
   loadNetworksData → hooks/useNetworks.ts
   loadNetworkConfig/save/delete → hooks/useNetworkConfig.ts
   loadMembers/… → hooks/useMembers.ts
   renderCurl/… → CurlBuilderPanel.tsx
   toast()         → Toast.tsx + useToast()
   copyText/copyEl → lib/clipboard.ts
   toggleTunnel    → TunnelBlock.tsx
   openNetworkPicker/closePicker → NetworkPicker.tsx
   toggleSidebar   → Sidebar.tsx
```

4. Routes:
```
   /                  → DashboardPanel
   /status            → StatusPanel
   /networks          → NetworksPanel
   /networks/create   → CreateNetworkPanel
   /networks/:nwid    → NetworkConfigPanel
   /members           → MembersPanel
   /members/:nwid/:id → MemberDetailPanel
   /api               → RawApiPanel
   /curl              → CurlBuilderPanel
   /settings          → SettingsPanel
```

---

## Tech Stack

| Concern         | Choice                                              |
|-----------------|-----------------------------------------------------|
| Bundler         | Vite 5                                              |
| Framework       | React 18                                            |
| Language        | TypeScript 5, `strict: true`                        |
| State           | Zustand                                             |
| Routing         | React Router v6                                     |
| HTTP            | native `fetch`                                      |
| Testing         | Vitest + @testing-library/react + jsdom             |
| Coverage        | v8 provider, uploaded to Codecov                    |
| Linting         | ESLint (@typescript-eslint, react-hooks, jsx-a11y)  |
| Formatting      | Prettier                                            |
| Commit policy   | Conventional Commits + commitlint + Husky           |
| Versioning      | semantic-release (auto tag + CHANGELOG on main)     |
| Security        | CodeQL weekly + dependency-review on PRs            |

---

## Constraints

- No UI library — replicate existing CSS design pixel-perfect
- No Tailwind — extracted CSS files only
- Every interactive element (toggle, tab, collapsible, toast, picker) works identically
- TypeScript strict mode throughout, zero `any`
- Each file max ~200 lines — split further if needed
- `VITE_BACKEND_URL` env var controls backend proxy target (default `http://localhost:3001`)
- `README.md` must include: prerequisites, dev setup, build, env vars, test run, CI badge, Codecov badge

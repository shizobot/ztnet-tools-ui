# Migration Map

## Markup

### Top-level shell

- `header` + connection controls (`#host`, `#token`, `#btnTest`, connection indicator, node-id text) migrate to `src/components/layout/Header.tsx`.
- `aside#sidebar` (`.nav-group`, `.nav-item`, mobile overlay `#sidebarOverlay`) migrates to `src/components/layout/Sidebar.tsx`.
- Mobile navigation (`#mobileNav`) migrates to `src/components/layout/MobileNav.tsx`.
- Floating action button (`#fab`) migrates to `src/components/layout/Fab.tsx`.
- Main content container (`<main id="main">`) becomes routed outlet in `src/App.tsx` + `src/router.tsx`.
- Shared widgets in panel markup (`.card`, `.btn`, `.badge`, `.toggle`, tables, route rows, toast area, terminals, picker modal) split into `src/components/ui/*`.

### Panel extraction (`panel-*` → `src/components/panels/*`)

- `panel-dashboard` → `DashboardPanel.tsx`
- `panel-status` → `StatusPanel.tsx`
- `panel-networks` → `NetworksPanel.tsx`
- `panel-create-network` → `CreateNetworkPanel.tsx`
- `panel-network-config` → `NetworkConfigPanel.tsx`
- `panel-members` → `MembersPanel.tsx`
- `panel-member-detail` → `MemberDetailPanel.tsx`
- `panel-raw-api` → `RawApiPanel.tsx`
- `panel-terminal` → `CurlBuilderPanel.tsx`
- `panel-settings` → `SettingsPanel.tsx`

## Styles

### CSS split plan

- `:root` design tokens block (`--bg`, `--accent`, radii, layout constants, animation timing) → `src/styles/tokens.css`.
- Reset/base/background layers (`*`, `html`, `body`, `body::before`, `body::after`, scrollbars, global typography) → `src/styles/base.css`.
- Structural layout rules (`header`, `.app-body`, `aside#sidebar`, `main`, mobile shell positioning) → `src/styles/layout.css`.
- Reusable UI patterns (`.btn`, `.card`, `.badge`, `.toggle`, `.route-row`, `.ip-tag`, `.notice`, `.toast`, terminal blocks, picker controls, tabs) → `src/styles/components.css`.
- Panel-specific surface + transitions (`.panel`, `.panel.active`, `.page-hdr`, `.cfg-section`, per-panel spacing variants) → `src/styles/panels.css`.

## Client Logic

### Explicit required logic mapping

- `const S` → `src/store/appStore.ts` (Zustand global app/controller state).
- `const N` → `CreateNetworkPanel.tsx` local `useState` for create-network form state.
- `const v6State` → `NetworkConfigPanel.tsx` local `useState` for IPv6 options.
- `EASY_RANGES` → `src/constants/easyRanges.ts`.
- `curlTpls` → `src/constants/curlTemplates.ts`.
- `api()` → `src/api/ztApi.ts` (`ztGet`, `ztPost`, `ztDelete` wrapper helpers).
- `toast()` → `src/components/ui/Toast.tsx` + `useToast` hook/context.
- `copyText` / `copyEl` → `src/lib/clipboard.ts`.
- `toggleTunnel` → `src/components/ui/TunnelBlock.tsx`.
- `openNetworkPicker` / `closePicker` → `src/components/ui/NetworkPicker.tsx`.
- `toggleSidebar` → `src/components/layout/Sidebar.tsx`.

### Additional function-group extraction

- Connection/prefs (`savePrefs`, `loadPrefs`, `testConnection`) → `src/hooks/useConnection.ts`.
- Networks list + filtering (`loadNetworksData`, filters/search) → `src/hooks/useNetworks.ts`.
- Network config CRUD (`loadNetworkConfig`, save/update/delete flows) → `src/hooks/useNetworkConfig.ts`.
- Members flows (`loadMembers`, `loadMemberDetail`, save member changes) → `src/hooks/useMembers.ts`.
- Curl rendering/building (`renderCurl`, template filling, copy actions) → `CurlBuilderPanel.tsx` + supporting UI components.

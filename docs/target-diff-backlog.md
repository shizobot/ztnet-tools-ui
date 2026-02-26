# Diff и backlog относительно целевого дерева из AGENTS.md

## 1) Diff текущего дерева

### infra/devex

- ❌ отсутствовал `.eslintrc.cjs` (в репозитории был только `eslint.config.js`).

### missing UI components/panels/constants

- ❌ отсутствовали `src/styles/layout.css` и `src/styles/components.css` (стили были разложены на `layout-*` и `components-*`).
- ❌ отсутствовали UI-компоненты:
  - `src/components/ui/Badge.tsx`
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Card.tsx`
  - `src/components/ui/IpTag.tsx`
  - `src/components/ui/TagBox.tsx`
  - `src/components/ui/Terminal.tsx`
  - `src/components/ui/Spinner.tsx`
  - `src/components/ui/TabBar.tsx`
  - `src/components/ui/TunnelBlock.tsx`
  - `src/components/ui/AddSubCard.tsx`

### parity тесты

- ❌ отсутствовал `src/__tests__/components/Badge.test.tsx`.

---

## 2) Backlog по группам

### infra/devex

- [x] **TASK-IF-01:** Добавить совместимый `.eslintrc.cjs`.
  - **Owner:** Frontend Platform
  - **Priority:** P1
  - **DoD:** файл присутствует, не ломает текущий `npm run lint`, репозиторий соответствует целевой структуре.

### missing UI components/panels/constants

- [x] **TASK-UI-01:** Добавить агрегирующие файлы `layout.css` и `components.css`, сохранив существующую разбивку стилей.
  - **Owner:** UI Architecture
  - **Priority:** P1
  - **DoD:** `App.tsx` импортирует `layout.css`/`components.css`, сборка проходит.

- [x] **TASK-UI-02:** Добавить отсутствующие UI-компоненты (Badge, Button, Card, IpTag, TagBox, Terminal, Spinner, TabBar, TunnelBlock, AddSubCard).
  - **Owner:** UI Core
  - **Priority:** P0
  - **DoD:** компоненты добавлены в `src/components/ui`, экспортируются в `index.ts`, типы strict-friendly, сборка/тесты проходят.

### parity тесты

- [x] **TASK-QA-01:** Добавить `Badge.test.tsx` для проверки базовой рендер-логики класса/контента.
  - **Owner:** QA Frontend
  - **Priority:** P1
  - **DoD:** тест стабилен в Vitest, проходит в общем наборе тестов.

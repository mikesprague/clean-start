# AGENTS.md

Clean Start — an open-source new-tab page shipped as **two build targets from one codebase**: a PWA (deployed on Cloudflare Pages, `cleanstart.page`) and a browser extension (zip for the Chrome Store). React 19 + Mantine 9 + Jotai + Vite 8 + TypeScript.

## Commands

- `npm start` — full-stack dev: watches the build and serves it (incl. `functions/api/`) via `wrangler pages dev --local`. Requires `.dev.vars` (see below).
- `npm run dev` — `vite serve`, frontend only; `/api/*` routes are NOT available (no proxy configured).
- `npm run build` — PWA build → `build/`
- `npm run build:extension` — extension build → `build/clean-start-extension.zip`
- `npm run lint` — oxlint (`./src` only)
- `npm run format` / `npm run format:check` — oxfmt (`./src` only; `functions/` is not linted/formatted by scripts)
- `npm run typecheck` — `tsc --noEmit`
- No test suite. `npm test` exits 1 by design — don't try to run or add test plumbing without being asked.
- The only GitHub workflow is Dependabot auto-merge — there is no CI lint/build gate. Verify locally before pushing:
  `npm run lint && npm run format:check && npm run typecheck`

## Architecture and gotchas

- `src/index.html` is **generated and transient**: `prebuild` copies `src/pwa.html` (or `src/extension.html` for `build:extension`) to it, `postbuild` deletes it. It is NOT gitignored — never edit it or commit it; edit `src/pwa.html` / `src/extension.html` instead.
- Vite `root` is `src/` (outDir `../build`, publicDir `../public`, `base: ''`). There is no `index.html` at repo root.
- Entry point: `src/index.tsx`. UI in `src/components/`, shared logic in `src/modules/`. Small flat codebase (~15 source files).
- Import alias: `@/*` → `src/*` (tsconfig paths + vite tsconfigPaths).
- Backend = `functions/api/*.js` — Cloudflare Pages Functions (`onRequestGet` handlers using the Cache API). Kept outside the Vite build entirely.
- TypeScript is TS 6 preview installed via npm alias (`"typescript": "npm:@typescript/typescript6@..."`). `strict: false`; don't assume strict-mode invariants.
- Node >= 24 / npm >= 11 (`.node-version` pins 26.x); `packageManager: npm@12` — use npm, not yarn/pnpm.

## Environment and secrets

- `.dev.vars` (gitignored, dotenv format) must define for local `npm start`:
  `UNSPLASH_ACCESS_KEY`, `UNSPLASH_SECRET_KEY`, `OPEN_WEATHERMAP_API_KEY`
- `.env`, `privatekey.pem`, `publickey.pem` also exist locally — all gitignored, never commit them.
- `.history/` is VS Code Local History output — generated, ignore it.

## Lint/format reality

- The lint/format scripts run **oxlint/oxfmt**, not ESLint/Prettier. `eslint.config.js` and `.prettierrc.cjs` (Mantine presets) exist for editor integration only — no npm script executes them.

## Commits and releases

- Conventional Commits are required (`feat:`, `fix:`, `chore(deps-dev):`, `build(vite):`, …). `CHANGELOG.md` is generated from them — never hand-edit it.
- Interactive commit prompt available via `npx cz` (cz-git).
- Release with `npm version <patch|minor|major>`: regenerates and stages `CHANGELOG.md`, creates the `chore(release): prepare release vX.Y.Z` commit, and signs the git tag (`sign-git-tag=true` in `.npmrc` — requires a configured signing key).
- Dependency bumps arrive via Dependabot PRs that auto-merge; don't hand-manage dep updates.

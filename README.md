# Cadenza

Cadenza is a focused practice operating system for musicians: a calm workspace for repertoire, exercises, sessions, goals, and long-term patterns.

## Run locally

```bash
npm install
npm run build
npm run preview
```

Then open [http://localhost:4173](http://localhost:4173).

`npm run test` runs the TypeScript project check. The build uses esbuild through `scripts/build.mjs`, which produces a static `dist/` bundle; `server.mjs` provides the small SPA preview server.

## Included workflows

- Dashboard with practice rhythm, streak, repertoire, insights, and calendar snapshots
- Instrument-aware repertoire and exercise libraries
- Persistent global practice timer with pause, resume, cancel, and session review
- Structured session notes, objectives, results, and confidence
- Goals with progress indicators and deadlines
- Practice log, monthly calendar, and statistics views
- Search across works, exercises, and practice notes
- JSON backup export and restore
- Responsive desktop/mobile layout with keyboard-friendly controls and visible focus states

The sample workspace is seeded with piano and guitar data so the instrument-agnostic model is visible immediately. Workspace state is persisted in `localStorage` under the versioned `cadenza-state-v1` key; the JSON backup flow keeps the data portable while a hosted database/auth layer can be introduced without changing the UI domain model.

The renamed product brief is preserved in [PRODUCT_PROMPT.md](./PRODUCT_PROMPT.md).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Arcade Vault: an online platform to play games and compete for the highest score. The project follows spec-driven development (`/spec` and `/spec-impl` workflow, using skills from `Klerith/fernando-skills`, installed via `npx skills@latest add Klerith/fernando-skills`). The code is currently a fresh Create Next App scaffold (`app/` has only the layout, home page and global CSS).

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`)
- No test runner is configured yet.

## Stack and gotchas

- Next.js 16.4.2 (App Router, `app/`), React 19.3, TypeScript strict, Tailwind CSS v4. Path alias `@/*` maps to the repo root.
- **This Next.js has breaking changes versus common training data.** Per `AGENTS.md`, read the relevant guide in `node_modules/next/dist/docs/` (`01-app`, `02-pages`, `03-architecture`, `04-community`) before writing Next.js code, and heed deprecation notices.
- `next.config.ts` enables `cacheComponents`, `partialPrefetching` and `experimental.agentFeedback`. `cacheComponents` changes caching/rendering semantics for all routes, so check the docs before adding data fetching.
- Tailwind runs through Turbopack: `next.config.ts` registers `@tailwindcss/turbopack` as a loader for `*.css`. Styles live in `app/globals.css` (`@import "tailwindcss"`, theme tokens via `@theme inline`, dark mode via `prefers-color-scheme`).
- `app/layout.tsx` types props with the global `LayoutProps<"/">` helper (generated route types) rather than hand-written prop types. Fonts are Geist Sans/Mono via `next/font/google`.
- `AGENTS.md` is re-written by `next dev`; leave it in place.

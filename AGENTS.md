<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:storyblok-component-schema-rules -->
# Storyblok components are stores in schema

Read the relevant guides at `node_modules/@jimdrury/storyblok-component-schema/skills/create-component/` before writing any code.
<!-- END:storyblok-component-schema-rules -->

## Cursor Cloud specific instructions

### Overview

Next.js 16 personal website with Storyblok CMS. Single-package repo using Yarn 4 (Corepack).

### Prerequisites

- **Corepack** must be enabled (`corepack enable`) before any `yarn` command.
- **`GITHUB_TOKEN`** env var is needed for `yarn install` because `@jimdrury/*` packages resolve from `npm.pkg.github.com` (see `.yarnrc.yml`).
- **`STORYBLOK_ACCESS_TOKEN`** and **`STORYBLOK_SPACE_ID`** must be in `.env.local` for the dev server to start. Create `.env.local` from the env vars before running `yarn dev`.

### Common commands

See `package.json` scripts. Key ones:

| Task | Command |
|------|---------|
| Dev server | `yarn dev` (HTTPS on `localhost:3000`) |
| Lint | `yarn lint` (Biome) |
| Tests | `yarn test` (Vitest, 162 tests) |
| Format | `yarn format` |

### Gotchas

- `yarn dev` uses `--experimental-https` and generates a self-signed cert on first run into `certificates/`. Browsers will show a security warning; accept it.
- The `.env.local` file is git-ignored. If the dev server fails at startup with a Zod validation error about `STORYBLOK_ACCESS_TOKEN`, the file is missing or incomplete.
- `lefthook` is installed via `yarn prepare` (postinstall hook). Git hooks run Biome on staged files and commitlint on commit messages.

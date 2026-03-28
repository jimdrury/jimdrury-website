# Jim Drury Personal Website

Source for [jimdrury.co.uk](https://www.jimdrury.co.uk), built with Next.js and Storyblok.

This repository is intentionally public so people can learn from the implementation and get inspired by patterns, structure, and content modeling decisions.

## Purpose

- Personal site and writing platform for Jim Drury.
- Not an open source project and not seeking external contributions.
- Pull requests are not expected.

## Tech Stack

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS 4
- Storyblok CMS
- Vitest + Testing Library
- Biome

## Local Development

### Prerequisites

- Node.js (current LTS recommended)
- Corepack enabled (`corepack enable`)
- Yarn 4 (managed via `packageManager` in `package.json`)

### Setup

```bash
cp .env.example .env.local
yarn install
yarn dev
```

App runs at `https://localhost:3000` (HTTPS is enabled in dev).

## Environment Variables

Copy `.env.example` to `.env.local` and set:

- `STORYBLOK_ACCESS_TOKEN`
- `STORYBLOK_API_TOKEN`
- `STORYBLOK_SPACE_ID`

## Available Scripts

- `yarn dev` - start local dev server
- `yarn build` - create production build
- `yarn start` - run production server
- `yarn lint` - run Biome checks
- `yarn format` - apply Biome formatting
- `yarn test` - run test suite once
- `yarn test:watch` - run tests in watch mode
- `yarn test:coverage` - run tests with coverage
- `yarn schema:plan` - preview Storyblok schema changes
- `yarn schema:apply` - apply Storyblok schema changes

## License and Reuse

This repository uses a custom source-available license in `LICENSE`.

You are welcome to read the code and take inspiration, but you may not copy, republish, or reuse substantial portions of this project (including source, design, or content) without explicit written permission.

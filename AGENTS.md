# Project verification

- Use Bun for package scripts; the repository tracks `bun.lock`.
- Type check: `bunx tsc --noEmit`.
- Lint: `bun run lint`.
- Unit tests: `bun run test:unit`. Vitest discovers `src/**/__tests__/**/*.test.ts` and excludes server integration tests.
- Production build: `bun run build`.
- Do not run `bun run test:integration` against an unverified database. The server tests delete rows in their setup; confirm an isolated disposable database and obtain approval first.
- `src/test/setup.ts` mocks React for server tests. React component unit tests must unmock React locally. Existing component tests use server rendering and mock upload/network hooks; they do not require live storage.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

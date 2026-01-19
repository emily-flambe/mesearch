# Ralph Loop Prompt

Copy and paste this command into Claude Code:

```
/ralph-wiggum:ralph-loop "Fix login functionality so users can authenticate on both localhost:8787 (dev-login) and mesearch.emilycogsdill.com (Cloudflare Access). Create E2E tests to verify. E2E tests passing is the source of truth. Steps each iteration: 1. Start local dev server: npx wrangler dev --port 8787 & 2. Run E2E tests: npm run test:e2e 3. If E2E tests pass locally, use Playwright MCP to manually verify on localhost:8787 and production. 4. If local works, deploy: npm run deploy 5. Commit and push: git add -A && git commit -m 'Fix login flow and add E2E tests' && git push 6. Check CI: gh pr checks --watch 7. If CI green, output done signal. Context: localhost uses dev-login cookie via /api/auth/dev-login endpoint. Production uses Cloudflare Access which sets Cf-Access-Authenticated-User-Email header. UserMenu.tsx has isLocalDev check to determine login URL. Current bug: Sign In link may be going to wrong URL. Key files: frontend/components/UserMenu.tsx, src/api/auth.ts, frontend/contexts/AuthContext.tsx. CRITICAL: Both environments must work. If stuck after 5 attempts on same error, ask user for guidance." --completion-promise "LOGIN_FIXED" --max-iterations 25
```

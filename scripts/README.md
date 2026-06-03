Usage: push selected env vars from your local `.env` to your Vercel project.

Requirements:
- Set `VERCEL_TOKEN` (personal token) in your shell.
- Set `VERCEL_PROJECT_ID` to your Vercel project id (or `VERCEL_PROJECT`).

Run:

```bash
npm run vercel:env:push
```

This script will read `.env` in the repo root and create/update the following
environment variables on the Vercel project: `BETTER_AUTH_SECRET`,
`DATABASE_URL`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_SITE_URL`.

Security: do NOT commit your `.env` file to GitHub. Use Vercel/GitHub secrets
for production values.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Create a `.env.local` (not committed) based on `.env.example`.

On macOS/Linux:
```bash
cp .env.example .env.local
```
On Windows PowerShell:
```powershell
Copy-Item .env.example .env.local
```

Then edit `.env.local` and fill in the values below. After any change you MUST restart the dev server so Next.js picks them up.

| Variable | Required | Purpose |
|----------|----------|---------|
| `ORS_API_KEY` | Optional (required for Route Planner / Geocode) | Server-side calls to OpenRouteService for distance/duration + geocoding. |
| `SPOTIFY_CLIENT_ID` | Optional (required for Playlist Starter images + search) | Spotify Client Credentials flow. |
| `SPOTIFY_CLIENT_SECRET` | Optional (required for Playlist Starter images + search) | Spotify Client Credentials flow. |

Example `.env.local` (DO NOT COMMIT real keys):
```
ORS_API_KEY=sk_openrouteservice_xxx
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Getting Spotify Credentials
1. Go to https://developer.spotify.com/dashboard
2. Log in and click "Create app" (name it e.g. "Bus2Ride Playlist Starter").
3. You do NOT need redirect URIs for the client credentials flow we use.
4. Copy the Client ID and Client Secret into `.env.local`.
5. Restart the dev server: stop it (Ctrl+C) then run `npm run dev` again.

### Verifying Spotify Setup
After setting the variables and restarting, visit:
```
/api/spotify-health
```
You should see `{ "ok": true, ... }`. If you get `spotify_auth_failed`, double‑check the ID/Secret and restart.

### Security Notes
* NEVER expose `SPOTIFY_CLIENT_SECRET` or `ORS_API_KEY` in client-side JavaScript.
* Only access them in server files / API routes (anything under `app/api/**`).
* Do not commit `.env.local` – it's already ignored. Use `.env.example` for documentation.

## Route Planner & Geocode Security

The client components call internal Next.js API routes which:
- Validate inputs
- Use your server-side `ORS_API_KEY`
- Return normalized JSON (distance in miles, duration in minutes)
- Avoid leaking the raw provider key or unnecessary payload

Endpoints:
- POST `/api/geocode` { address }
- POST `/api/plan-route` { start, end }

Responses have shape:
```
{ ok: boolean, error?: string, data?: {...} }
```

If you deploy to Vercel, set `ORS_API_KEY` in the project settings under Environment Variables.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

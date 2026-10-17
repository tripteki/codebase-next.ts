<h1 align="center">Codebase Next.js</h1>

Web frontend built with Next.js 16 (Pages Router), React 19, Tailwind CSS 4, Flowbite, and PWA support. It talks to Codebase FastAPI, Codebase NestJS, or Codebase Laravel through one REST contract.

## Conventions

| Topic | Rule |
|-------|------|
| Brand | Codebase. Primary `#2563eb`, secondary `#84cc16`, tertiary `#1e3a8a` |
| Roles | `superadmin`, `admin`, `user` |
| Format | Indent 4, double quotes, trailing commas, space before `(`. New files use Allman braces. No JSDoc in `src/libs` or hooks |
| Auth pages | `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password` |
| Validation | HTTP 422 `{ "detail": [...] }` from the backend |
| Locales | `en`, `id`, `ms` |

Cursor rules live in `.cursor/rules/`.

## Features

| Feature | Technology |
|---------|------------|
| SSR and static export | Next.js 16 + Turbopack |
| Authentication | NextAuth.js (credentials, JWT session) |
| Internationalization | next-i18next (cookie, no URL prefix) |
| UI | Tailwind CSS 4 + Flowbite |
| Admin | Users, roles, permissions, activities, notifications, settings, dashboard |
| Realtime | Socket.IO or Laravel Echo |
| Web Push | VAPID |
| State | Redux Toolkit |
| PWA | Manifest + service worker |
| Charts | ApexCharts |

## Getting Started

### Requirements

- Node.js 20+ (22 LTS recommended)
- npm 10+

### Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:3000`.

### Configuration

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | This app's URL |
| `NEXT_PUBLIC_BASE_URL` | Backend API URL ending in `/api` |
| `NEXT_PUBLIC_AUTH_URL` | Backend auth URL ending in `/api/v1/auth` |
| `NEXT_PUBLIC_API_URL` | Backend root URL |
| `NEXT_PUBLIC_REALTIME_DRIVER` | `socketio` for FastAPI and NestJS, `echo` for Laravel |
| `NEXT_PUBLIC_REVERB_*` | Reverb key, host, port, and scheme when the driver is `echo` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Optional Web Push key |
| `NEXT_PUBLIC_BRAND_*` | Optional brand color overrides (hex) |
| `NEXTAUTH_URL`, `SECRET` | NextAuth URL and session secret |

`NEXT_PUBLIC_*` values are inlined at build time. The backend must allow this app's origin in its CORS settings.

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start the production build |
| `npm run generate` | Static export in `out/` |
| `npm run lint` | Lint and format |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |

Pages ending in `.page.tsx` build for the server. Pages ending in `.static.tsx` build for the static export.

## Docker

The image is `node:24-alpine` and runs the Next standalone server.

```bash
cp .env.example .env
docker compose up -d --build
```

`NEXT_PUBLIC_*` values are inlined at build time from `.env`, so rebuild after changing them. `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and `SECRET` are read at runtime. Compose maps `api.backend.localhost` and `host.docker.internal` to the Docker host, so a backend published on the host is reachable from the container.

## Routes

| Path | Access |
|------|--------|
| `/` | Public |
| `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password` | Guest |
| `/auth/reset-password/[email]`, `/auth/verify-email/[email]` | Signed link |
| `/admin/dashboard` | Signed in |
| `/admin/users`, `/admin/roles`, `/admin/permissions`, `/admin/activities` | Signed in with permission |
| `/admin/settings`, `/notifications` | Signed in |

`/admin/auth/:path*` redirects to `/auth/:path*`.

## Authentication

NextAuth runs at `/api/auth/[...nextauth]` with a JWT session. The backend `accessToken` is stored in the session and sent as `Authorization: Bearer` on API calls.

## Realtime

| Driver | Backend | Transport |
|--------|---------|-----------|
| `socketio` | FastAPI, NestJS | `socket.io-client` |
| `echo` | Laravel | Laravel Echo + Reverb |

Notifications and admin refresh events are wired in `use-notification-broadcast` and `use-admin-refresh`. For other events, use the shared client:

```typescript
import { socket } from "@/libs/socket";

const { data: client } = await socket();

client?.subscribeUserEvent(userId, "v1.user.admin.exported", (payload) => {
    console.log(payload.fileUrl);
});
```

| Event | Payload |
|-------|---------|
| `v1.notification.created` | `id`, `unread` |
| `v1.admin.refresh` | `userId`, `scopes` |
| `v1.user.admin.imported` | `userId`, `filename`, `totalImported`, `totalSkipped` |
| `v1.user.admin.exported` | `userId`, `filename`, `fileUrl` |
| `v1.user.admin.activated`, `v1.user.admin.deactivated` | User fields |

## UI and Theme

| Item | Location |
|------|----------|
| Styles | `src/styles/globals.css`, `src/styles/brand-theme.css` |
| Class tokens | `src/libs/flowbite-classes.ts` |
| Components | `src/components/flowbite/fb-*.tsx` |
| Brand colors | `src/libs/branding.ts` |
| Translations | `src/langs/{en,id,ms}/` |
| PWA assets | `public/manifest/`, `public/sw.js` |

## Project Structure

```
codebase-next.ts/
├── pages/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── langs/
│   ├── layouts/
│   ├── libs/
│   └── styles/
├── next.config.ts
├── next-i18next.config.js
└── proxy.ts
```

## Author

- Trip Teknologi ([@tripteki](https://linkedin.com/company/tripteki))
- Hasby Maulana ([@hsbmaulana](https://linkedin.com/in/hsbmaulana))

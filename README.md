<h1 align="center">Codebase Next.js</h1>

Web frontend built with **Next.js 16** (Pages Router), **React 19**, **next-i18next 16**, **NextAuth.js 4**, **Tailwind CSS 4**, and **PWA** support. Consumes a backend-agnostic HTTP API via `NEXT_PUBLIC_*_URL` environment variables.

### Features

| No | Feature | Description | Technology |
|----|---------|-------------|------------|
| 1 | Pages Router | SSR + static export dual build | Next.js 16 + Turbopack |
| 2 | Authentication | Login, register, forgot/reset password, verify email | NextAuth.js (Credentials) |
| 3 | API proxy | Auth flows proxied to backend API | Next.js API routes |
| 4 | I18N | English, Indonesian, Malay (cookie-based, no URL prefix) | next-i18next 16 + i18next 26 |
| 5 | UI | Auth layout, dashboard, theme toggle | Tailwind CSS 4 + shadcn/ui |
| 6 | User & profile | `/users/me`, interests, password update | `useUserProfile` → REST API |
| 7 | Notifications | List, read, delete, unread badge | `useNotifications` → `/api/v1/notifications/*` |
| 8 | Real-time | Notifications + optional admin events | `useNotificationBroadcast` + Echo/Reverb or Socket.IO |
| 9 | Web Push | VAPID subscribe via API routes | `pages/api/webpush/*` |
| 10 | State | Client state for app features | Redux Toolkit |
| 11 | PWA | Manifest, service worker, icons, splash screens | public/manifest + sw.js |
| 12 | Static export | Pre-rendered HTML for static hosting | `npm run generate` |
| 13 | SEO | Page titles, manifest, theme-color | `_document` + manifest API |

Getting Started
---

### Requirements

- Node.js >= 20 (recommended: 22 LTS)
- npm >= 10

### Installation

```bash
cd codebase-next.ts

npm install

cp .env.example .env
```

### Configuration

Update `.env`:

```env
NEXT_PUBLIC_APP_NAME=codebase
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://api.backend.localhost/api
NEXT_PUBLIC_AUTH_URL=http://api.backend.localhost/api/v1/auth
NEXT_PUBLIC_API_URL=http://api.backend.localhost
NEXT_PUBLIC_REVERB_APP_KEY=codebase-key
NEXT_PUBLIC_REVERB_HOST=127.0.0.1
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_REVERB_SCHEME=http
NEXT_PUBLIC_REALTIME_DRIVER=echo
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_LANG=en
PORT=3000
SECRET=123456
I18NEXT_DEFAULT_CONFIG_PATH="./next-i18next.config.js"
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API root URL (Swagger: `{API_URL}/api/docs`) |
| `NEXT_PUBLIC_REALTIME_DRIVER` | `echo` (Reverb, default) or `socketio` (Socket.IO API) |
| `NEXT_PUBLIC_REVERB_*` | Required when `REALTIME_DRIVER=echo` |
| `NEXT_PUBLIC_*` | Public runtime config (inlined at build time) |
| `SECRET` | NextAuth JWT/session secret |
| `I18NEXT_DEFAULT_CONFIG_PATH` | Path to `next-i18next.config.js` |

Ensure the API backend is running and `FRONTEND_URL` / CORS settings allow this app origin.

### Running the Application

#### Development

```bash
npm run dev
```

App: `http://localhost:3000`

#### Production (Node server)

```bash
npm run build
npm run start
```

#### Static export

```bash
npm run generate
```

Output: `out/` (static HTML + assets). Suitable for CDN/static hosting without Node.

#### Lint

```bash
npm run lint
```

#### Add shadcn component

```bash
npm run component
```

### Routes

| Path | Auth | Description |
|------|------|-------------|
| `/` | guest | Landing page |
| `/admin/auth/login` | guest | Login |
| `/admin/auth/register` | guest | Register |
| `/admin/auth/forgot-password` | guest | Forgot password |
| `/admin/auth/reset-password` | guest | Reset password (token query) |
| `/admin/dashboard` | required | Dashboard |
| `/auth/reset-password/[email]` | guest + signed | Reset via signed URL |
| `/auth/verify-email/[email]` | guest + signed | Email verification |

Auth redirects: `/auth/login` → `/admin/auth/login` (and similar aliases handled in pages).

### Authentication

- Session strategy: **JWT** via NextAuth.js
- Backend: `POST /api/v1/auth/login`, `register`, `logout`, `me`, etc.
- Access token stored in JWT payload; sent as `Authorization: Bearer {token}` to the API
- Protected pages use `getServerSideProps` + client `useRequireAuth`

NextAuth route: `/api/auth/[...nextauth]`

### Internationalization

- Locales: `en`, `id`, `ms`
- Strategy: **no URL prefix** - locale stored in cookie `i18n_redirected`
- Translation files: `src/langs/{locale}/{auth,common}.json`
- Pages Router imports: `next-i18next/pages`, `next-i18next/pages/serverSideTranslations`
- Language switcher syncs with `i18n.language` from SSR (no hydration mismatch)

Config: `next-i18next.config.js`

### PWA

Assets live under `public/`:

| Path | Description |
|------|-------------|
| `/manifest.webmanifest` | Web app manifest (SSR: rewritten to `/api/manifest`) |
| `/manifest/icon-*.png` | App icons (192, 384, 512) |
| `/manifest/splash/*.png` | Apple splash screens |
| `/favicon.ico` | Favicon |
| `/sw.js` | Service worker (registered in production only) |

Re-sync icons/favicon/splash from backend assets:

```bash
bash ../scripts/sync-pwa-assets.sh
```

Source: API server `public/favicon.ico` and `public/asset/logo.png`

### Real-time

The app supports two realtime drivers via `NEXT_PUBLIC_REALTIME_DRIVER`:

| Driver | API | Transport |
|--------|-----|-----------|
| `echo` (default) | Reverb broadcast | Laravel Echo + Reverb (Pusher protocol) |
| `socketio` | Socket.IO | `socket.io-client` |

Values are read from `src/libs/runtime-config.ts` and `src/libs/realtime-config.ts`. Use `.env` for local overrides (for example `localhost:8000`); `.env.example` shows the default template URLs.

#### Echo driver (`echo`)

```env
NEXT_PUBLIC_REALTIME_DRIVER=echo
NEXT_PUBLIC_REVERB_APP_KEY=codebase-key
NEXT_PUBLIC_REVERB_HOST=127.0.0.1
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_REVERB_SCHEME=http
```

Requires API with `BROADCAST_CONNECTION=reverb`, a running Reverb server, and `POST /broadcasting/auth`.

#### Socket.IO driver (`socketio`)

```env
NEXT_PUBLIC_REALTIME_DRIVER=socketio
NEXT_PUBLIC_API_URL=http://localhost:8000
```

- WebSocket auth uses the **access token** (Bearer).
- **Email must be verified** — the API rejects Socket.IO connections when `email_verified_at` is empty.
- Multi-worker APIs may use Redis as a Socket.IO message queue; configure `MEMORY_REDIS_*` for production.

#### Client API

Bootstrap via `socket()` or `createRealtimeClient()` (`src/libs/realtime-client.ts`):

```typescript
import { socket, } from "@/libs/socket";

const { data: client, isSuccess, } = await socket();

if (isSuccess && client)
{
    client.subscribeUserEvent (userId, "v1.notification.created", (payload) =>
    {
        // { id, unread }
    });
}
```

Notifications are wired automatically in `useNotificationBroadcast` (used by `NotificationShellExtras`).

#### Admin import / export events

Subscribe with the same pattern when you need live progress on admin pages:

```typescript
client.subscribeUserEvent (userId, "v1.user.admin.imported", (payload) =>
{
    // { userId, filename, totalImported, totalSkipped }
});

client.subscribeUserEvent (userId, "v1.user.admin.imported-failed", (payload) =>
{
    // { userId, filename, error }
});

client.subscribeUserEvent (userId, "v1.user.admin.exported", (payload) =>
{
    // { userId, filename, fileUrl, filePath }
});

client.subscribeUserEvent (userId, "v1.user.admin.exported-failed", (payload) =>
{
    // { userId, error }
});

client.subscribeUserEvent (userId, "v1.user.admin.activated", (payload) => { /* ... */ });
client.subscribeUserEvent (userId, "v1.user.admin.deactivated", (payload) => { /* ... */ });
```

Call `client.unsubscribe()` or `client.disconnect()` when leaving the page.

#### Broadcast events (all backends)

| Event | Payload (summary) |
|-------|-------------------|
| `v1.notification.created` | `id`, `unread` |
| `v1.user.admin.imported` | `userId`, `filename`, `totalImported`, `totalSkipped` |
| `v1.user.admin.imported-failed` | `userId`, `filename`, `error` |
| `v1.user.admin.exported` | `userId`, `filename`, `fileUrl`, `filePath` |
| `v1.user.admin.exported-failed` | `userId`, `error` |
| `v1.user.admin.activated` | user fields (`id`, `name`, `email`, …) |
| `v1.user.admin.deactivated` | user fields (`id`, `name`, `email`, …) |

With `echo`, events use a leading dot when listening on a private channel (handled inside `subscribeUserEvent`). With `socketio`, event names are used as-is.

Low-level Echo helper (`echo` driver): `src/libs/echo.ts` → `createEcho(accessToken)`.

### Dual build (SSR vs static)

| Extension | Build command | Use case |
|-----------|---------------|----------|
| `*.page.tsx` | `npm run build` | SSR / Node server |
| `*.static.tsx` | `npm run generate` | Static export |

Shared logic lives in `src/`; page files re-export or mirror the same UI.

### Project Structure

```
frontend/
├── pages/
│   ├── _app.page.tsx              # appWithTranslation wrapper
│   ├── _document.page.tsx         # HTML shell, PWA meta, splash links
│   ├── admin/auth/                # Auth pages (SSR)
│   ├── admin/dashboard/
│   ├── api/auth/                  # NextAuth + auth API proxies
│   └── auth/                      # Signed URL flows
├── src/
│   ├── components/                # UI + i18n-switcher, theme-toggle
│   ├── hooks/                     # auth, i18n, theme
│   ├── langs/                     # en, id, ms JSON
│   ├── layouts/                   # header, footer, auth
│   └── libs/                      # echo, realtime-client, call, runtime-config
├── public/
│   ├── manifest/                  # PWA icons + splash
│   ├── favicon.ico
│   └── sw.js
├── next.config.ts
├── next-i18next.config.js
├── proxy.ts                       # Next.js 16 proxy (replaces middleware)
└── .env.example
```

Author
---

- Trip Teknologi ([@tripteki](https://linkedin.com/company/tripteki))
- Hasby Maulana ([@hsbmaulana](https://linkedin.com/in/hsbmaulana))

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json .npmrc ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --no-audit --no-fund

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app

ARG NEXT_PUBLIC_APP_NAME=codebase
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_BASE_URL=http://api.backend.localhost/api
ARG NEXT_PUBLIC_AUTH_URL=http://api.backend.localhost/api/v1/auth
ARG NEXT_PUBLIC_API_URL=http://api.backend.localhost
ARG NEXT_PUBLIC_REALTIME_DRIVER=socketio
ARG NEXT_PUBLIC_REVERB_APP_KEY=
ARG NEXT_PUBLIC_REVERB_HOST=127.0.0.1
ARG NEXT_PUBLIC_REVERB_PORT=8080
ARG NEXT_PUBLIC_REVERB_SCHEME=http
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY=
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_APP_LANG=en

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    BUILD_STANDALONE=true \
    NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME} \
    NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL} \
    NEXT_PUBLIC_AUTH_URL=${NEXT_PUBLIC_AUTH_URL} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_REALTIME_DRIVER=${NEXT_PUBLIC_REALTIME_DRIVER} \
    NEXT_PUBLIC_REVERB_APP_KEY=${NEXT_PUBLIC_REVERB_APP_KEY} \
    NEXT_PUBLIC_REVERB_HOST=${NEXT_PUBLIC_REVERB_HOST} \
    NEXT_PUBLIC_REVERB_PORT=${NEXT_PUBLIC_REVERB_PORT} \
    NEXT_PUBLIC_REVERB_SCHEME=${NEXT_PUBLIC_REVERB_SCHEME} \
    NEXT_PUBLIC_VAPID_PUBLIC_KEY=${NEXT_PUBLIC_VAPID_PUBLIC_KEY} \
    NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV} \
    NEXT_PUBLIC_APP_LANG=${NEXT_PUBLIC_APP_LANG}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm rebuild \
    && npx next build \
    && cp -r public/.next/standalone /out \
    && rm -rf /out/public/.next/standalone \
    && find public -mindepth 1 -maxdepth 1 ! -name .next -exec cp -r {} /out/public/ \; \
    && cp -r public/.next/static /out/public/.next/static \
    && cp next-i18next.config.js /out/

FROM node:${NODE_VERSION}-alpine AS runtime

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

WORKDIR /app

COPY --from=build --chown=node:node /out ./

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO /dev/null "http://127.0.0.1:${PORT}/" || exit 1

CMD ["node", "server.js"]

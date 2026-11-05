FROM node:22-alpine AS build
WORKDIR /app
COPY package.json yarn.lock* ./
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn \
    set -eu; \
    attempt=1; \
    until yarn install --frozen-lockfile --ignore-engines --network-timeout 600000; do \
        if [ "$attempt" -ge 3 ]; then \
            exit 1; \
        fi; \
        delay=$((attempt * 5)); \
        echo "Dependency install attempt $attempt failed; retrying in ${delay}s." >&2; \
        sleep "$delay"; \
        attempt=$((attempt + 1)); \
    done
COPY . .
RUN yarn build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV NODE_WEB_CLIENT_SSR_PORT=5480
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/build ./build
COPY --from=build /app/env ./env
EXPOSE 5480
HEALTHCHECK --interval=15s --timeout=5s --start-period=25s --retries=6 \
    CMD node -e "fetch('http://127.0.0.1:5480/health').then(r=>r.text()).then(t=>{if(!t.startsWith('healthy'))process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "dist/main.js"]


FROM node:20-slim AS builder

WORKDIR /app

RUN set -ex && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY modified_modules/ ./node_modules/

COPY . .

RUN yarn build

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

EXPOSE 3000

CMD ["node", "dist/index.js"] 
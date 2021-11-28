#-----------------------------
# Build and deploy back-end.
#-----------------------------

FROM node:14.18.1 AS compilation

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY src ./src

RUN npm ci && npm run build


FROM node:14.18.1-alpine3.12 AS production

ENV PORT=8080
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=compilation /usr/src/app/package*.json ./
COPY --from=compilation /usr/src/app/dst ./dst

RUN npm ci

LABEL maintainer="Yaroslav Surilov <ysurilov@domain.com>"
HEALTHCHECK --interval=10s --timeout=3s CMD wget --quiet --spider --tries=1 127.0.0.1:${PORT}/healthcheck || exit 1

EXPOSE ${PORT}/TCP

CMD ["npm", "run", "prod"]

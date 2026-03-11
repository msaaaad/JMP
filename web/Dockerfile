# Stage 1: Build React App
FROM node:lts-alpine AS build-stage
WORKDIR /app/web
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production server
FROM alpine:3.18 AS production-stage
RUN apk add --no-cache lighttpd gettext

WORKDIR /var/www/html
COPY --from=build-stage /app/web/dist .

# Copy Lighttpd config
COPY lighttpd.conf /etc/lighttpd/lighttpd.conf

# Entrypoint to inject environment variables at runtime
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]

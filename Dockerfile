FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN chown -R node:node /app
USER node
EXPOSE 4000
CMD ["sh", "-c", "node src/db/migrate.js && node src/server.js"]

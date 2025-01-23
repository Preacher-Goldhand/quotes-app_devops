FROM node:23-alpine

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY /src .

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

CMD ["node", "app.js"]

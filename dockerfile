FROM node:20-alpine AS frontend_builder

WORKDIR /app

COPY ./frontend/package*.json ./

RUN npm ci

COPY ./frontend .


FROM  node:20-alpine AS frontend_dev

WORKDIR /app

COPY --from=frontend_builder /app /app

COPY ./frontend/package*.json ./

RUN npm ci

COPY ./frontend .

EXPOSE 5173

CMD ["npm", "run", "dev"]

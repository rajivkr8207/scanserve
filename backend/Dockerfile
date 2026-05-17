FROM node:22-alpine

WORKDIR /app

# Copy shared directory
COPY shared ./shared

# Copy backend directory
COPY backend ./backend

WORKDIR /app/backend

# Install dependencies
RUN npm install

EXPOSE 8000

CMD ["npm", "run", "dev"]
# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy only production dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

# Copy only production source files
COPY server.js ./
COPY models/ ./models/
COPY controllers/ ./controllers/
COPY routes/ ./routes/
COPY middleware/ ./middleware/
COPY alimanaka_extracted.json ./
COPY seed.js ./

EXPOSE 5000

CMD ["node", "server.js"]

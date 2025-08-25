# Stage 1: Build the Next.js app
FROM node:18 AS builder
WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy all source files including .env.local
COPY . .

# Build with env variables
RUN npm run build

# Stage 2: Run Next.js in production
FROM node:18
WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app ./

# Expose Next.js production port
EXPOSE 9191

# Run Next.js with production environment
CMD ["npm", "start", "--", "-p", "9191", "-H", "0.0.0.0"]

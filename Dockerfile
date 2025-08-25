# Stage 1: Build the Next.js app
FROM node:22.16.0 AS builder
WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy everything (including .env.local)
COPY . .

# Build Next.js for production
RUN npm run build

# Stage 2: Run the Next.js app in production
FROM node:22.16.0
WORKDIR /app

# Copy only required files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env.local ./.env.local  # ✅ ensure env file is available at runtime

# Expose Next.js production port
EXPOSE 9191

# Start the Next.js app in production mode
CMD ["npm", "run", "start", "--", "-p", "9191", "-H", "0.0.0.0"]

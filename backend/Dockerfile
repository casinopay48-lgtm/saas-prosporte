# Simple Dockerfile for hub-server (suitable for Railway/Render)
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Environment
ENV NODE_ENV=production

# Start
CMD ["node", "hub-server.js"]

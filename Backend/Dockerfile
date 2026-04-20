# Step 1: Build Stage
FROM node:20-alpine
WORKDIR /app

# Install dependencies first (better for caching)
COPY package*.json ./
RUN npm install --production --legacy-peer-deps
# Copy source code
COPY . .

# Your app runs on 3000
EXPOSE 3000

CMD ["node", "server.js"]
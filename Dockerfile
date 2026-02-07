FROM node:22-alpine

WORKDIR /app

# Install deps first (cache-friendly)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest (in dev, bind-mount overwrites it)
COPY . .

EXPOSE 3000
CMD ["npm","run","dev"]


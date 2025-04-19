# Dockerfile (inside MobApp folder)

FROM node:18

# Set working directory
WORKDIR /app

# Copy only necessary files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend app
COPY . .

# Build the web version
RUN npm run build:web

# Serve it using 'serve'
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]

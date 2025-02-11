# Build stage
FROM node:21-alpine AS builder

# Install Angular CLI globally
RUN npm install -g @angular/cli@18.0.0

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install lite-server --save-dev

# Copy source code
COPY . .

# Build the app
RUN ng build --configuration=production

# Create a simple lite-server config with logging disabled
RUN echo '{ "port": 9200, "files": ["./dist/tienda_llaves_front/browser/**/*.{html,htm,css,js}"], "server": { "baseDir": "./dist/tienda_llaves_front/browser" }, "logLevel": "silent", "notify": false }' > bs-config.json

# Expose port 9200
EXPOSE 9200

# Start lite-server
CMD ["./node_modules/.bin/lite-server", "--config", "bs-config.json"]

# docker build -t tienda_llaves_front .
# docker run -d -p 9200:9200 tienda_llaves_front
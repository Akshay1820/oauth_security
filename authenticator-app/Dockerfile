# Stage 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the project for production
RUN npm run build --configuration=production

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx configuration to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built production files from Stage 1 to Nginx public folder
COPY --from=build /app/dist/authenticator-app/browser /usr/share/nginx/html

# Since SSR is enabled, the client-side SPA entry point is built as index.csr.html.
# Rename it to index.html so Nginx serves it as the default index file.
RUN mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

# Expose port 80 to the outside world
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

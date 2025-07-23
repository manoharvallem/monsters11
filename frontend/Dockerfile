# Stage 1: Build Stage
# Use a Node.js image to build our React application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the React application for production
# This will create a 'dist' folder with optimized static files.
RUN npm run build

# Stage 2: Production Stage
# Use a lightweight Nginx server to serve our static files
FROM nginx:stable-alpine

# Copy the built assets from the 'build' stage to Nginx's web root directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
# We will create this file in a later step. It tells Nginx how to handle routing.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (the default HTTP port that Nginx listens on)
EXPOSE 80

# The default command for the nginx image is to start the server.
CMD ["nginx", "-g", "daemon off;"]

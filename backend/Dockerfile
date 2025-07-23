# Stage 1: Use an official Node.js runtime as a parent image
# We use the 'alpine' version because it's lightweight, which results in a smaller image size.
FROM node:18-alpine

# Set the working directory inside the container to /app
# All subsequent commands (like COPY, RUN) will be executed from this directory.
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory.
# We copy these first to leverage Docker's layer caching. If these files don't change,
# Docker won't re-run the 'npm install' step on subsequent builds, speeding up the process.
COPY package*.json ./

# Install the application dependencies inside the container.
# 'npm ci' is often recommended for CI/CD environments as it installs exact versions
# from package-lock.json, ensuring reproducible builds.
RUN npm install

# Copy the rest of your application's source code into the container.
# The '.' refers to the build context (our 'backend' folder), and the second '.'
# refers to the current working directory inside the container (/app).
COPY . .

# Expose port 5000. This informs Docker that the container listens on this port at runtime.
# This does not actually publish the port; that's done in the docker-compose.yml or with the 'docker run -p' flag.
EXPOSE 5000

# Define the command to run your application.
# This is the command that will be executed when the container starts.
# It will run 'node src/index.js'.
CMD [ "npm", "start" ]

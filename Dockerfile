# Step 1: Use the official Node.js image for building the React app
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Step 2: Use an NGINX image to serve the built React app
FROM nginx:1.25

# Copy the built React app from the build stage to the NGINX HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom NGINX configuration if necessary (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port that NGINX will run on
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

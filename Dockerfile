# Use official Node.js image as base
FROM node:latest

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

COPY prisma ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN npm run generate

# Build TypeScript code
RUN npm run build

# Expose the port your app runs on
EXPOSE 80

# Command to run the application
CMD ["npm", "start"]
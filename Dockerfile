# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 5173 (default for Vite)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]

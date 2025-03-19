# Use Node.js lightweight image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose the port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]

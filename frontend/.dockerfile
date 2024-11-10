FROM node:20-alpine
# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the built files
RUN npm install -g serve

EXPOSE 3000
EXPOSE 5173

# Command to run the server
CMD ["npm", "run", "dev"]

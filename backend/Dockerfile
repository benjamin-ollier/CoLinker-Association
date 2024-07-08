# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Install system dependencies including Python and build tools
RUN apk add --no-cache python3 make g++ py3-pip

# Change ownership to node user to avoid permission issues
RUN chown -R node:node /app
USER node

# Install dependencies
COPY --chown=node:node package*.json ./
RUN npm install

# Copy the application source with the appropriate permissions
COPY --chown=node:node . .

# Compile TypeScript (If necessary, adjust the command based on your tsconfig.json)
# RUN npx tsc

# Expose the port the app runs ons
EXPOSE 8000

# Command to run the app
CMD ["npm", "start"]

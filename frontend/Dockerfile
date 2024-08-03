# Use Node.js LTS image as base
FROM node:14

# Frontend env
ENV REACT_APP_AUTH0_DOMAIN="Your Auth0 Domain"
ENV REACT_APP_AUTH0_CLIENT_ID="Your Auth0 Client ID"
ENV REACT_APP_AUTH0_CALLBACK_URL="https://skketsy.xyz"
ENV REACT_APP_API_BASE_URL="https://api.skketsy.xyz"
ENV REACT_APP_AUTH0_AUDIENCE="Your Auth0 Audience"
ENV REACT_APP_GOOGLE_MAP_KEY="Your Google Map Key"
ENV REACT_APP_MAP_ID="Your Map ID"

# Set the working directory in the container for frontend
WORKDIR /app

# Copy frontend package.json and package-lock.json
COPY ./frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend application code
COPY ./frontend/ ./

# Expose port 3000
EXPOSE 3000

# Start frontend server
CMD ["npm", "start"]

# Use Node.js latest image as base
FROM node:18

# Backend env
ENV MONGODB_CONNECTION_STRING="mongodb+srv://admin:Admin@integrationproject.xxxxxxxx.mongodb.net/airbnb_clone"
ENV PORT=4000
ENV API_URL="https://api.skketsy.xyz"
ENV AWS_BUCKET_NAME="integration-project-airbnb-clone"
ENV AWS_BUCKET_REGION="us-east-1"
ENV AWS_ACCESS_KEY="Your AWS Access Key"
ENV AWS_SECRET_ACCESS_KEY="Your AWS Secret Access Key"
ENV STRIPE_SECRET_KEY="Your Stripe Secret Key"
# ENV STRIPE_WEBHOOK_SECRET_KEY="..."
ENV STRIPE_WEBHOOK_SECRET_KEY="Your Stripe Webhook Secret Key"
ENV REDIRECT_URL="https://skketsy.xyz"

# Set the working directory in the container for backend
WORKDIR /app

# Copy backend package.json and package-lock.json
COPY ./backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend application code
COPY ./backend/ ./

# Expose port 4000 (if required)
EXPOSE 4000

# Command to run the backend server
CMD ["npm", "run", "dev"]

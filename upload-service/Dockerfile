# Stage 1: Build the application
FROM oven/bun:alpine AS builder

# Set the working directory for building
WORKDIR /app

# Copy the full source code to the builder stage
COPY . .

# Install only production dependencies (if Bun supports it) then build the project
RUN bun install --frozen-lockfile --production && bun run build

# Stage 2: Create the production image with only the dist folder
# Use a slimmer base image if available. For example, if there's an Alpine-based version:
FROM oven/bun:alpine

# Set the working directory in the final image
WORKDIR /app

# Copy only the built dist folder from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 9200

# Command to run the application from the dist folder (adjust the startup command as necessary)
CMD ["bun", "run", "dist/index.js"]
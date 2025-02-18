# Use the official NGINX image as the base image
FROM nginx:stable-alpine

# Delete the previous nginx.conf if it exists (optional)
RUN rm -f /etc/nginx/nginx.conf

# Copy your custom NGINX configuration to the container
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Expose the port NGINX will listen on
EXPOSE 80

# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]

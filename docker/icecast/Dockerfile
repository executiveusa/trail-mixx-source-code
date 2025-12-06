FROM alpine:3.19

# Install Icecast
RUN apk add --no-cache icecast

# Create directory for logs
RUN mkdir -p /var/log/icecast

# Copy custom configuration
COPY icecast.xml /etc/icecast.xml

# Expose ports
EXPOSE 8000

# Run Icecast
CMD ["icecast", "-c", "/etc/icecast.xml"]

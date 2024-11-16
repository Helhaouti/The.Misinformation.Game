# Set the Python version for the base image using a Docker argument.
ARG PYTHON_VERSION=3.12

FROM python:${PYTHON_VERSION}-slim as base

# Set the working directory in the container.
WORKDIR /app

# Copy the requirements.txt file to the container
COPY requirements.txt .

# Install Python packages using pip
RUN python -m pip install --no-cache-dir -r requirements.txt gunicorn

# Copy the application source code into the Docker image.
COPY . /app

# Create a non-privileged user as best practices for Docker.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser 

# Switch to the non-privileged user.
USER appuser

# Expose port for the application.
EXPOSE 8080

# Define servername 
ENV SERVER_NAME="0.0.0.0:8080"

# Start the flask web server application.
CMD ["gunicorn", "-b", "0.0.0.0:8080", "-w", "3", "--access-logfile", "-", "--error-logfile", "-", "app:create_app()"]


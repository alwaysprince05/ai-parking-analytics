# Use a lightweight Python base image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies for OpenCV and other libraries
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Hugging Face Spaces use port 7860 by default
EXPOSE 7860

# Command to serve the web dashboard
# We use the built-in python http server for simplicity and reliability in the Space
CMD ["python3", "-m", "http.server", "7860", "--directory", "web_dashboard"]

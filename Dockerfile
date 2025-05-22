# Use an updated secure Python runtime as a parent image
FROM python:3.10-slim-bullseye

# Set the working directory to /app
WORKDIR /app

# Install system dependencies for building C++ libraries, then clean up in one layer
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    libboost-dev \
    libpolyclipping-dev \
    libnlopt-cxx-dev \
    libcairo2 \
    libcairo2-dev \
    libpango1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

# Install Python libraries in one step
RUN pip install opencv-python-headless flask svgpathtools cairosvg pymongo payos python-dotenv

# Copy all files and folders from the current directory to /app in the container
COPY . /app

# Build the project using the pre-existing sources of libnest2d and pybind11
RUN rm -rf build && mkdir build && cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release -DPYTHON_EXECUTABLE=$(which python3) && \
    cmake --build . --config Release -- -j2

ENV PYTHONPATH=/app/build:$PYTHONPATH

# Create directory for logs
RUN mkdir -p /app/log

# Expose port for Flask
EXPOSE 5000

# Run Flask app directly
CMD ["python", "app.py"]

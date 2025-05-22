# Use an official Python runtime as a parent image
FROM python:3.8-slim-buster

# Thêm dòng này ở đầu Dockerfile
ARG VERSION=latest

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
RUN pip install opencv-python-headless flask svgpathtools cairosvg gunicorn pymongo payos

# Copy all files and folders from the current directory to /app in the container
COPY . /app

# Build the project using the pre-existing sources of libnest2d and pybind11
RUN rm -rf build && mkdir build && cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release -DPYTHON_EXECUTABLE=$(which python3) && \
    cmake --build . --config Release -- -j2

ENV PYTHONPATH=/app/build:$PYTHONPATH

# Expose port for Gunicorn
EXPOSE 5000

# Run Gunicorn when the container launches
CMD ["gunicorn", "-c", "gunicorn_config.py", "app:app"]

# Thêm label cho version
LABEL version=$VERSION

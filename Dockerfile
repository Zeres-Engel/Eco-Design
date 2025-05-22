# Use Python 3.8 which is compatible with the pybind11 version in the project
FROM python:3.8-slim-bullseye

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

# Install Python libraries in one step with pinned versions
RUN pip install --no-cache-dir \
    opencv-python-headless==4.8.1.78 \
    flask==2.3.3 \
    svgpathtools==1.6.1 \
    cairosvg==2.7.1 \
    pymongo==4.6.1 \
    payos==0.1.8 \
    python-dotenv==1.0.0

# Copy all files and folders from the current directory to /app in the container
COPY . /app

# Build the project using the pre-existing sources of libnest2d and pybind11
RUN rm -rf build && mkdir build && cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release -DPYTHON_EXECUTABLE=$(which python3) && \
    cmake --build . --config Release -- -j2

ENV PYTHONPATH=/app/build:$PYTHONPATH

# Create directory for logs
RUN mkdir -p /app/log && chmod 755 /app/log

# Create a non-root user and switch to it
RUN adduser --disabled-password --gecos "" appuser \
    && chown -R appuser:appuser /app
USER appuser

# Expose port for Flask
EXPOSE 5000

# Run Flask app directly
CMD ["python", "app.py"]

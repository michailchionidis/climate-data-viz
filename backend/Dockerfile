# =============================================================================
# Multi-stage Dockerfile for Climate Data Visualization Backend
# =============================================================================
# Stages:
#   1. builder    - Install dependencies
#   2. test       - Run tests (used by CI/CD)
#   3. production - Minimal runtime image
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Builder - Install all dependencies
# -----------------------------------------------------------------------------
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml ./

# Create virtual environment and install ALL dependencies (including dev)
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir ".[dev]"

# -----------------------------------------------------------------------------
# Stage 2: Test - Run tests (target: test)
# -----------------------------------------------------------------------------
FROM python:3.11-slim AS test

WORKDIR /app

# Install curl for potential healthchecks during testing
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder (includes dev dependencies)
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy application and test code
COPY ./app ./app
COPY ./data ./data
COPY ./tests ./tests
COPY pyproject.toml ./

# Default command: run tests with coverage
CMD ["pytest", "tests/", "-v", "--cov=app", "--cov-report=term-missing", "--cov-report=xml:coverage.xml"]

# -----------------------------------------------------------------------------
# Stage 3: Production - Minimal runtime image
# -----------------------------------------------------------------------------
FROM python:3.11-slim AS production

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment and install ONLY production dependencies
COPY pyproject.toml ./
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir .

# Copy application code (no tests in production)
COPY ./app ./app
COPY ./data ./data

# Create non-root user for security
RUN adduser --disabled-password --gecos "" appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

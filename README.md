# Climate Data Visualization Platform

[![Tests](https://github.com/YOUR_USERNAME/climate-data-viz/workflows/Test/badge.svg)](https://github.com/YOUR_USERNAME/climate-data-viz/actions)
[![Backend Coverage](https://img.shields.io/badge/backend%20coverage-82%25-brightgreen)](https://github.com/YOUR_USERNAME/climate-data-viz)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://github.com/YOUR_USERNAME/climate-data-viz)

A full-stack web application for exploring and visualizing historical climate data from weather stations worldwide. Built with **FastAPI** and **React**, following **TDD** practices and **Domain-Driven Design**.

![Dashboard Preview](docs/images/dashboard-preview.png)

## 🎯 Features

- **Multi-station Selection**: Select one or multiple weather stations to compare
- **Statistical Analytics**: View min, max, mean temperatures and trends
- **Visualization Modes**:
  - **Monthly Data**: Display temperature data per month for each year
  - **Annual Averages**: Aggregate data as yearly averages
  - **±1σ Overlay**: Visualize standard deviation range around annual means
- **Interactive Zoom**: Focus on specific year ranges with precision controls
- **Responsive Design**: Optimized for desktop and tablet viewing

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────────────┐  │
│  │   Station   │ │   Controls   │ │      Chart Panel        │  │
│  │  Selector   │ │    Panel     │ │  (Plotly.js)            │  │
│  └─────────────┘ └──────────────┘ └─────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Analytics Panel                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI + DDD)                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      API Layer                            │  │
│  │  router.py ──▶ aggregates domain routers                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Domain Layer                           │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │  │
│  │  │  stations/  │ │climate_data/│ │     analytics/      │ │  │
│  │  │  routes     │ │   routes    │ │      routes         │ │  │
│  │  │  schemas    │ │   schemas   │ │      schemas        │ │  │
│  │  │  service    │ │   service   │ │      service        │ │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Shared Services                         │  │
│  │  data_service.py ──▶ CSV loading & DataFrame caching     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Core Infrastructure                     │  │
│  │  exceptions.py │ dependencies.py │ logging.py            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   CSV Dataset   │
                    │  (1859-2019)    │
                    └─────────────────┘
```

### Backend: Domain-Driven Design

The backend follows **Domain-Driven Design (DDD)** principles, organizing code by business domain rather than technical layer:

| Domain | Responsibility | Endpoints |
|--------|----------------|-----------|
| **stations** | Weather station listing | `GET /stations` |
| **climate_data** | Temperature data retrieval | `GET /data/monthly`, `GET /data/annual` |
| **analytics** | Statistical computations | `GET /analytics` |
| **shared** | Cross-domain data access | CSV loading, DataFrame caching |

**Benefits of this architecture:**
- ✅ **Encapsulation**: Each domain is self-contained with its own routes, schemas, and services
- ✅ **Scalability**: Easy to add new domains without affecting existing code
- ✅ **Maintainability**: Find code by feature, not by technical layer
- ✅ **Testability**: Domain-specific tests with clear boundaries
- ✅ **Team-friendly**: Multiple developers can work on different domains independently

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework with automatic OpenAPI docs
- **pandas** - Data processing and statistical computations
- **Pydantic** - Data validation and serialization
- **pytest** - Testing framework with coverage reporting
- **Domain-Driven Design** - Clean architecture pattern

### Frontend
- **React 19** - UI library with TypeScript
- **Vite** - Fast build tool and dev server
- **Chakra UI** - Accessible component library
- **Plotly.js** - Interactive scientific charting
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client

### Infrastructure
- **Docker Compose** - Container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Pre-commit hooks** - Code quality enforcement
- **AWS** - Cloud deployment (EC2/App Runner)

## 📦 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── router.py         # Aggregates domain routers
│   │   │   └── schemas.py        # Re-exports for backwards compat
│   │   ├── core/
│   │   │   ├── dependencies.py   # FastAPI DI
│   │   │   ├── exceptions.py     # Custom exceptions
│   │   │   └── logging.py        # Structured logging
│   │   ├── domains/              # ⭐ Domain-Driven Design
│   │   │   ├── shared/
│   │   │   │   └── data_service.py   # CSV loading & caching
│   │   │   ├── stations/
│   │   │   │   ├── routes.py     # API endpoints
│   │   │   │   ├── schemas.py    # Pydantic models
│   │   │   │   └── service.py    # Business logic
│   │   │   ├── climate_data/
│   │   │   │   ├── routes.py
│   │   │   │   ├── schemas.py
│   │   │   │   └── service.py
│   │   │   └── analytics/
│   │   │       ├── routes.py
│   │   │       ├── schemas.py
│   │   │       └── service.py
│   │   ├── config.py             # App configuration
│   │   └── main.py               # FastAPI app entry
│   ├── data/
│   │   └── temperature_data_extended.csv
│   ├── tests/
│   │   ├── test_analytics.py     # TDD: domain service tests
│   │   └── test_api.py           # API integration tests
│   ├── Dockerfile
│   └── pyproject.toml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StationSelector.tsx
│   │   │   ├── ControlsPanel.tsx
│   │   │   ├── AnalyticsPanel.tsx
│   │   │   └── ChartPanel.tsx
│   │   ├── hooks/
│   │   │   └── useClimateData.ts
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .pre-commit-config.yaml
└── .github/workflows/
    ├── test.yml
    └── deploy.yml
```

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/climate-data-viz.git
cd climate-data-viz

# Build and start the application
docker compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Running Tests with Docker

```bash
# Run backend tests
docker compose run --rm backend-test

# Run frontend tests
docker compose run --rm frontend-test
```

### Local Development

#### Setup Pre-commit Hooks (Recommended)
```bash
# Install pre-commit
pip install pre-commit

# Install hooks (runs automatically before each commit)
pre-commit install

# Run manually on all files
pre-commit run --all-files
```

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"

# Run linting
ruff check app tests
ruff format app tests

# Run tests with coverage
pytest --cov=app --cov-report=term-missing

# Start development server
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Run tests
npm run test:coverage

# Build for production
npm run build
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/stations` | GET | List all weather stations |
| `/api/v1/data/monthly` | GET | Get monthly temperature data |
| `/api/v1/data/annual` | GET | Get annual averages with std |
| `/api/v1/analytics` | GET | Get statistical summary |
| `/health` | GET | Health check endpoint |

### Query Parameters

**GET /api/v1/data/monthly**
- `stations` (required): Comma-separated station IDs
- `year_from` (optional): Start year filter
- `year_to` (optional): End year filter

**GET /api/v1/data/annual**
- Same as monthly, returns mean and std per year

**GET /api/v1/analytics**
- `stations` (required): Comma-separated station IDs
- `year_from` (optional): Start year filter
- `year_to` (optional): End year filter

## 🧪 Testing Strategy (TDD)

This project follows **Test-Driven Development** practices:

1. **Unit Tests**: Core analytics functions (mean, std, filtering)
2. **Integration Tests**: API endpoints with test data
3. **Coverage Threshold**: Minimum 80% code coverage enforced in CI

```bash
# Run backend tests with coverage
cd backend
pytest --cov=app --cov-report=html --cov-fail-under=80

# Run frontend tests
cd frontend
npm test -- --coverage
```

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

1. **Pre-commit Checks** (first gate):
   - Code formatting (Ruff)
   - Linting
   - Type checking (mypy)

2. **On Push/PR**:
   - Run backend tests with coverage
   - Run frontend tests and linting
   - Build Docker images
   - Integration tests

3. **On Release**:
   - Build production images
   - Push to container registry
   - Deploy to AWS

## 🌿 Git Workflow & Branch Protection

This project follows a **trunk-based development** workflow with protected main branch:

### Branch Strategy
- `main` - Production-ready code, protected branch
- `feature/*` - Feature development branches
- `fix/*` - Bug fix branches

### Branch Protection Rules (Recommended)
Configure these rules in GitHub Settings → Branches → Add rule for `main`:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass:
  - `Pre-commit Checks`
  - `Backend Tests`
  - `Frontend Tests`
  - `Docker Build`
  - `Integration Tests`
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

### Contribution Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit (using conventional commits)
git commit -m "feat: add new visualization mode"

# Push and create PR
git push origin feature/your-feature-name
# Then create PR via GitHub UI
```

### Conventional Commits
This project uses [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## 📊 Design Decisions & Tradeoffs

### Why Domain-Driven Design?
- **Encapsulation**: Each domain (stations, climate_data, analytics) is self-contained
- **Scalability**: Adding new features = adding new domains
- **Team-friendly**: Clear boundaries for parallel development
- **Maintainability**: Find code by feature, not by layer

### Why In-Memory Data (pandas) vs Database?
- **Simplicity**: CSV is ~160 years × 12 months × 10 stations ≈ 19,200 rows - easily fits in memory
- **Performance**: No I/O overhead, instant filtering and aggregations
- **Scalability Note**: For production with millions of records, would migrate to TimescaleDB or ClickHouse

### Why Plotly.js vs D3.js/Chart.js?
- **Scientific Focus**: Built-in zoom, pan, hover with data inspection
- **Statistical Charts**: Native support for error bars, shaded regions (±σ)
- **Interactivity**: Zoom/pan without custom implementation

### Why Chakra UI?
- **Accessibility**: Built-in ARIA compliance
- **Consistency**: Design tokens for consistent theming
- **Speed**: Pre-built components accelerate development

## 🚧 Future Improvements

- [ ] Add data export functionality (CSV, PNG)
- [ ] Implement user presets/bookmarks
- [ ] Add comparison mode (side-by-side stations)
- [ ] Integrate real-time weather API
- [ ] Add predictive trend analysis

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ for Tesla's Full Stack Engineering assessment.

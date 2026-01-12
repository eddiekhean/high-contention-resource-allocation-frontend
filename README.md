# High Contention Resource Allocation & Simulation Platform

## 1. Project Overview

This project is a comprehensive engineering simulation platform designed to demonstrate and visualize solution strategies for complex backend problems. Using a modern full-stack architecture, it provides interactive simulations for scenarios involving **high-contention resource locking** (e.g., voucher disbursement) and **algorithmic pathfinding** (e.g., maze navigation).

The system serves both as a learning tool for system design concepts and a showcase of robust application architecture, featuring a separation of concerns between high-performance Go services and computation-heavy Python microservices, all accessible via a responsive React frontend.

## 2. Features

*   **Voucher Allocation Simulation**: Visualizes the challenges of distributing limited resources under high concurrency.
*   **Labyrinth Algorithm Viz**: Interactive tool to generate mazes (DFS/Recursive Backtracker) and visualize traversal algorithms (BFS, DFS, A*, Greedy).
*   **Real-time Visualization**: Dynamic rendering of algorithm states and system metrics.
*   **Interactive Controls**: User-configurable parameters for simulations (e.g., maze size, loop ratio, animation speed).
*   **Modular Design**: extensible "Scratchpad" architecture for adding new simulation modules.

## 3. System Architecture

The project follows a modular microservices-inspired architecture:

*   **Frontend (Web)**: A Single Page Application (SPA) built with React and Vite. It communicates with the backend via REST APIs.
*   **Backend (Core)**: Written in **Go (Golang)**, handling API requests, business logic for resource allocation, and maintaining system state.
*   **Microservice (Compute)**: A **Python** service dedicated to heavy computational tasks such as maze generation and complex algorithm processing.
*   **Database**: **PostgreSQL** for persistent data (user state, vouchers).
*   **Caching/Locking**: **Redis** used for distributed locks and high-speed counters during high-contention scenarios.

## 4. Tech Stack

### Frontend
*   **Language**: TypeScript / JavaScript (ESNext)
*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Styling**: CSS Modules / PostCSS
*   **State Management**: React Hooks & Context

### Backend
*   **Core**: Go (Golang)
*   **Compute Service**: Python 3.10+ (FastAPI)
*   **Gateway**: Nginx (optional/production)

### Infrastructure
*   **Databases**: PostgreSQL, Redis
*   **Containerization**: Docker, Docker Compose
*   **Orchestration**: Makefiles for local dev

## 5. Project Structure

This repository focuses on the frontend application structure:

```
frontend/
├── apps/
│   └── web/               # Main React Application
│       ├── src/
│       │   ├── components/# Reusable UI components & Feature widgets
│       │   ├── pages/     # Route-level page components
│       │   ├── services/  # API integration and logic adapters
│       │   └── styles/    # Global styles and theme definitions
├── Makefile               # Orchestration scripts for local development
├── package.json           # Root dependency management
└── pnpm-lock.yaml         # Dependency lock file
```

## 6. Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   pnpm (recommended) or npm
*   Go (for running backend locally)
*   Python (for running maze service locally)
*   Docker (optional, for backing services)

### Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/eddiekhean/high-contention-resource-allocation.git
    cd high-contention-resource-allocation/frontend
    ```

2.  **Install Dependencies**:
    ```bash
    make install
    # OR
    pnpm install
    ```

3.  **Start Development Server**:
    ```bash
    make dev
    # OR
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 7. Configuration

Configuration is managed via environment variables. Create a `.env` file in `apps/web/` if needed.

**Key Variables:**
*   `VITE_API_URL`: URL of the backend API (Default: `http://localhost:8080/api/v1` or production URL).

## 8. Usage

### Running Labyrinth Simulation
1.  Navigate to the **LeetCode / Labyrinth** section.
2.  Set Dimensions (Rows/Cols) and Loop Ratio.
3.  Click **Generate** to create a new maze structure via the Python service.
4.  Select a traversal strategy (e.g., BFS) and click **Solve** to visualize the pathfinding.

## 9. Testing

*   **Unit Tests**:
    ```bash
    npm run test
    ```
*   **Linting**:
    ```bash
    npm run lint
    ```

## 10. Performance & Scalability

*   **Frontend**: Utilizes `canvas` for rendering large mazes (up to 50x50 grids) to ensure 60fps performance during animations, avoiding DOM-reflow bottlenecks common with div-based grids.
*   **Backend**: The Go backend uses optimistic locking and Redis Lua scripts to handle voucher requests, capable of sustaining thousands of concurrent requests per second.

## 11. Security Considerations

*   **Input Validation**: All simulation parameters (rows, cols) are validated on both client and server to prevent resource exhaustion attacks.
*   **CORS**: Configured to strictly allow only the frontend origin in production.

## 12. Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

## 13. License

Distributed under the MIT License. See `LICENSE` for more information.

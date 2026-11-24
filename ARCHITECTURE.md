# System Architecture

The DPM-DSS utilizes a modern, decoupled architecture designed for high availability, security, and scalability. 

## Architectural Flow

```mermaid
graph TD
    %% Define styles
    classDef frontend fill:#38bdf8,stroke:#0284c7,stroke-width:2px,color:#fff;
    classDef backend fill:#34d399,stroke:#059669,stroke-width:2px,color:#fff;
    classDef ai fill:#a78bfa,stroke:#7c3aed,stroke-width:2px,color:#fff;
    classDef db fill:#fb923c,stroke:#ea580c,stroke-width:2px,color:#fff;
    classDef external fill:#94a3b8,stroke:#475569,stroke-width:2px,color:#fff;

    %% Nodes
    Client["Client (React SPA)"]:::frontend
    Auth["Auth Gateway (OAuth2 / SAML)"]:::backend
    API["FastAPI Backend Services"]:::backend
    
    DB[(PostgreSQL - Primary Data)]:::db
    Cache[(Redis - Cache & Sessions)]:::db
    
    AIEngine["Decision Support Engine (Python)"]:::ai
    PredictiveModels["Predictive ML Models"]:::ai
    
    Reporting["Reporting & Analytics Engine"]:::backend
    
    ERP["External ERP System (SAP)"]:::external

    %% Connections
    Client -->|HTTPS / REST| Auth
    Auth -->|Token Validation| API
    
    API -->|Read/Write| DB
    API -->|Cache Requests| Cache
    
    API -->|Request Insights| AIEngine
    AIEngine -->|Fetch Historical Data| DB
    AIEngine -->|Execute Inference| PredictiveModels
    
    API -->|Generate PDF| Reporting
    
    API -.->|Sync Procurement| ERP
```

## Component Breakdown

### 1. React Frontend
- **Technology**: React 18, Vite, Tailwind CSS, TanStack Query, Recharts.
- **Responsibility**: Provides the responsive, interactive user interface. Handles local state management, caching of network requests, and renders advanced SVG charts.

### 2. FastAPI Backend Services
- **Technology**: Python, FastAPI, SQLAlchemy, Pydantic.
- **Responsibility**: Serves as the core API gateway. Handles business logic, RBAC (Role-Based Access Control) enforcement, data validation, and routes requests to the AI engine or database.

### 3. Decision Support Engine
- **Technology**: Python, scikit-learn, Pandas.
- **Responsibility**: Analyzes schedule and cost variances (SPI/CPI) to predict project delays and budget overruns. Generates actionable recommendations based on historical DRDO project data.

### 4. PostgreSQL Database
- **Technology**: PostgreSQL 15.
- **Responsibility**: Acts as the single source of truth for all projects, milestones, users, audit logs, and financial records. Includes strict schema validations and encrypted at rest.

### 5. Reporting & Analytics
- **Technology**: Puppeteer (or equivalent PDF generator), Pandas.
- **Responsibility**: Aggregates complex portfolio data to generate static, immutable PDF reports for executive briefings.

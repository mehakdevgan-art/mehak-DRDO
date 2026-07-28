# API Documentation

The DPM-DSS backend exposes a RESTful API powered by FastAPI. All endpoints are prefixed with `/api/v1` and require an HTTP Bearer Token (JWT) for authentication.

## Authentication Endpoints

### `POST /api/v1/auth/login`
Authenticates a user and returns a JWT token.
- **Request Body:** `{ "username": "...", "password": "..." }`
- **Response:** `{ "access_token": "ey...", "token_type": "bearer", "role": "Project Director" }`

---

## Dashboard Endpoints

### `GET /api/v1/dashboard/summary`
Retrieves top-level KPIs for the executive dashboard.
- **Query Params:** `department_id` (optional)
- **Response:**
  ```json
  {
    "total_projects": 14,
    "overall_progress": 72.5,
    "budget_utilization": 72.4,
    "mission_readiness": 91,
    "high_risk_projects": 3
  }
  ```

### `GET /api/v1/dashboard/insights`
Retrieves AI-generated recommendations and insights.
- **Response:**
  ```json
  [
    {
      "id": "ins_123",
      "type": "Schedule Risk",
      "title": "Testing Phase Bottleneck",
      "description": "Increase testing resources for Secure Communication Network.",
      "confidence_score": 0.94,
      "priority": "High"
    }
  ]
  ```

---

## Project Endpoints

### `GET /api/v1/projects`
Lists all active projects based on user permissions.
- **Query Params:** `status`, `risk_level`, `department_id`
- **Response:** Array of Project objects.

### `GET /api/v1/projects/{project_id}`
Retrieves detailed information for a specific project.
- **Response:** Includes timeline, milestones, SPI, CPI, and assigned personnel.

### `POST /api/v1/projects/{project_id}/milestones`
Adds or updates a milestone. *(Requires `Project Manager` or higher)*
- **Request Body:** `{ "name": "Hardware Validation", "status": "Completed", "date": "2026-07-19" }`

---

## Alerting Endpoints

### `GET /api/v1/alerts`
Retrieves the active smart alerts.
- **Query Params:** `severity` (info, warning, critical)
- **Response:** Array of Alert objects.

---

## Analytics Endpoints

### `GET /api/v1/reports/executive`
Generates the payload required for the Executive Summary view.
- **Response:** Contains aggregated progress, budget, top risks, and strategic recommendations.

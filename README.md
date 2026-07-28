# AI-Powered Defence Project Monitoring & Decision Support System (DPM-DSS)

*"Intelligent Monitoring and Decision Support for Strategic Defence Projects"*

## Overview

The DPM-DSS is a comprehensive, enterprise-grade web application designed for the Defence Research and Development Organisation (DRDO). It provides senior management, project directors, and scientists with real-time visibility into the health, schedule, budget, and risks of strategic defence projects.

At its core, DPM-DSS leverages predictive analytics and an AI Decision Support Engine to automatically surface insights, detect potential delays, forecast budget overruns, and recommend strategic resource reallocations.

## Key Features

- **Strategic Dashboard**: Real-time KPIs including Schedule Performance Index (SPI), Cost Performance Index (CPI), and a weighted Mission Readiness Score.
- **Smart Alert Center**: Automated notifications for critical procurement delays, resource overallocation, and milestone successes.
- **Portfolio Analytics**: Side-by-side project comparison and interactive department budget tracking.
- **Executive Reporting**: One-click generation and PDF export of comprehensive project status and executive summaries.
- **Immutable Audit Log**: Transparent tracking of all configuration changes and critical project updates.

## User Roles & Permissions

The system supports a hierarchical, role-based access control (RBAC) architecture to ensure data security and appropriate authority levels:

| Role | Permissions |
|------|-------------|
| **Administrator** | Full system access. Can modify roles, system thresholds, and global configurations. |
| **Project Director** | Portfolio-wide visibility. Can approve budget changes, reallocate resources across departments, and view all executive summaries. |
| **Senior Scientist** | Technical visibility into assigned domain projects. Can update milestones and flag technical risks. |
| **Project Manager** | Read/write access to assigned projects. Can adjust timelines, log expenditures, and manage team members. |
| **Finance Officer** | Access to financial analytics, budget utilization, and CPI metrics. Can flag funding constraints. |
| **Department Head** | Can view resource utilization, risk heatmaps, and project performance within their specific division. |
| **Quality Assurance** | Can update testing milestones and trigger alerts for validation delays. |
| **Viewer** | Read-only access to high-level dashboards and public milestones. |

## Quick Start (Local Development)

### Prerequisites
- Node.js (v18+) and Python 3.12+.
- The backend uses SQLite by default for a zero-configuration demonstration. Set `DATABASE_URL` in `backend/.env` for PostgreSQL.

### Installation
1. Start the backend in one terminal:
   ```bash
   cd backend
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
2. Start the frontend in another terminal:
   ```bash
   npm install
   npm run dev
   ```
3. Open the Vite URL (normally `http://localhost:5174` in this workspace) and sign in with `admin@drdo.local` / `Admin@123`.

The frontend reads `VITE_API_URL` from `.env`; copy `.env.example` to `.env` if the API is not running at `http://127.0.0.1:8000`.

Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

## Future Enhancements
- Integration with live procurement databases (SAP/ERP).
- Multi-factor authentication (MFA) and biometric login integration.
- Advanced AI natural language querying for historical project data.

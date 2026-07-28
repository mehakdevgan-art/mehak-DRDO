# AI Defence Project Monitoring API

Async FastAPI backend for the project-monitoring dashboard. It uses SQLAlchemy 2, JWT RBAC, Pydantic validation, deterministic seed data, rule-based AI recommendations, and a prediction-service boundary that can later be replaced with ML/RAG.

## Run

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for Swagger. The default local configuration uses SQLite; set `DATABASE_URL` in `.env` to the PostgreSQL connection shown in `.env.example` for deployment.

Seeded admin credentials: `admin@drdo.local` / `Admin@123` (change immediately outside demo use). Obtain a token via `POST /auth/login`, then authorize in Swagger.

Core endpoints: `/dashboard`, `/projects`, `/projects/{id}`, `/departments`, `/tasks`, `/milestones`, `/budget`, `/risks`, and `/reports/portfolio`.

## AI decision support

The local explainable analysis layer is under `app/ai/`. It uses no OpenAI, LangChain, or network API. With a bearer token, query these Swagger-documented endpoints with a `project_id`:

- `GET /ai/project-health`
- `GET /ai/budget-analysis`
- `GET /ai/risk-analysis`
- `GET /ai/predictions`
- `GET /ai/recommendations`
- `GET /ai/project-summary`

The analysis services deliberately return plain JSON and are isolated from route logic so future ML, OpenAI, LangChain, RAG, or vector-store providers can replace the local rules without changing the API contract.

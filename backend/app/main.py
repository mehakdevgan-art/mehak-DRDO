import logging
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi import HTTPException
from .config import get_settings
from .database import Base, SessionLocal, engine
from .routers.api import router
from .seed import seed_database
logging.basicConfig(level=logging.INFO,format="%(asctime)s %(levelname)s %(name)s %(message)s")
@asynccontextmanager
async def lifespan(_:FastAPI):
    if settings.environment.lower() == "production":
        if settings.secret_key == "development-only-change-me":
            raise RuntimeError("Set SECRET_KEY to a strong random value in production.")
        if settings.admin_password == "Admin@123":
            raise RuntimeError("Set ADMIN_PASSWORD to a unique value in production.")
    async with engine.begin() as connection: await connection.run_sync(Base.metadata.create_all)
    async with SessionLocal() as session: await seed_database(session)
    yield
    await engine.dispose()
settings=get_settings(); app=FastAPI(title=settings.app_name,version="1.0.0",description="Secure decision-support API for defence project monitoring.",lifespan=lifespan)
# Permit the documented localhost origins plus private-LAN Vite hosts for demos.
# This intentionally excludes arbitrary public origins while supporting VS Code's Network URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    # Vite starts at 5173 and increments the port when one is occupied.
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}):517\d$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(router)
@app.get("/health",tags=["System"])
async def health(): return {"status":"healthy","environment":settings.environment}

@app.get("/{full_path:path}", include_in_schema=False)
async def serve_frontend(full_path: str):
    static_dir = Path(__file__).resolve().parents[1] / "static"
    index_file = static_dir / "index.html"
    if not index_file.is_file():
        raise HTTPException(status_code=404, detail="Not found")
    requested_file = (static_dir / full_path).resolve()
    if static_dir.resolve() in requested_file.parents and requested_file.is_file():
        return FileResponse(requested_file)
    return FileResponse(index_file)

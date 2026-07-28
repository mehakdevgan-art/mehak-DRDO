import asyncio
from alembic import context
from sqlalchemy.ext.asyncio import async_engine_from_config
from app.config import get_settings
from app.database import Base
import app.models.entities  # Register metadata.
config = context.config
target_metadata = Base.metadata
def run_migrations_offline():
    context.configure(url=get_settings().database_url,target_metadata=target_metadata,literal_binds=True,dialect_opts={"paramstyle":"named"})
    with context.begin_transaction(): context.run_migrations()
def do_run_migrations(connection):
    context.configure(connection=connection,target_metadata=target_metadata)
    with context.begin_transaction(): context.run_migrations()
async def run_migrations_online():
    engine=async_engine_from_config({"sqlalchemy.url":get_settings().database_url},prefix="sqlalchemy.")
    async with engine.connect() as connection: await connection.run_sync(do_run_migrations)
    await engine.dispose()
if context.is_offline_mode(): run_migrations_offline()
else: asyncio.run(run_migrations_online())

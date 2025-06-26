from decouple import config
from .SQLEngine import SQLEngine
from .PostgresEngine import PostgresEngine

postgres_engine = PostgresEngine(
                root_db="",
                host="localhost",
                port=5432,
                user=config("POSTGRES_USER"),
                password=config("POSTGRES_PASSWORD"),
            )

__all__ = [
    "SQLEngine",
    "PostgresEngine",
    "postgres_engine",
]
from .PostgresEngine import PostgresEngine

eng = PostgresEngine("", "localhost", 5432, "postgres", " ")

sql_dump = """
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL
);

INSERT INTO users (username, email) VALUES
('alice', 'alice@example.com'),
('bob', 'bob@example.com');
"""
print (eng.create_db("1", sql_dump))
-- Migration: Initial schema for IoT Dashboard application
CREATE TABLE IF NOT EXISTS users
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  username   TEXT UNIQUE NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT        NOT NULL,
  role       TEXT     DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensors
(
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  type      TEXT NOT NULL,
  value     REAL NOT NULL,
  unit      TEXT,
  user_id   INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

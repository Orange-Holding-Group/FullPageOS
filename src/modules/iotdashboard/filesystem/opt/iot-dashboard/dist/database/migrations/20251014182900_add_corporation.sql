-- Migration: Add corporation table
CREATE TABLE IF NOT EXISTS corporation
(
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT UNIQUE NOT NULL,
  code       TEXT UNIQUE NOT NULL,
  address    TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

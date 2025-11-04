-- Migration: Add magnet monitor config
CREATE TABLE IF NOT EXISTS magnet_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  data_type TEXT DEFAULT 'string',
  description TEXT,
  user_editable BOOLEAN default 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category, key)
);

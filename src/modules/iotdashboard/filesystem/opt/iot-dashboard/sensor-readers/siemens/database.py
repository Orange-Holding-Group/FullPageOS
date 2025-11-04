# database.py
import sqlite3
import json
from datetime import datetime
import threading

class Database:
  _instance = None
  _lock = threading.Lock()

  def __new__(cls, db_file='/opt/iot-dashboard/dist/database/app.db'):
    if cls._instance is None:
      with cls._lock:
        if cls._instance is None:
          cls._instance = super(Database, cls).__new__(cls)
          cls._instance.db_file = db_file
    return cls._instance

  def get_connection(self):
    """Get a thread-safe database connection"""
    conn = sqlite3.connect(self.db_file, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

  def get_config(self, category, key):
    """Get a configuration value"""
    conn = self.get_connection()
    cursor = conn.cursor()

    cursor.execute('''
                   SELECT value, data_type FROM magnet_config
                   WHERE category = ? AND key = ?
                   ''', (category, key))

    row = cursor.fetchone()
    conn.close()

    if row:
      value, data_type = row
      return self._cast_value(value, data_type)
    return None

  def get_all_config(self):
    """Get all configuration as a dictionary"""
    conn = self.get_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT category, key, value, data_type FROM magnet_config ORDER BY category, key')
    rows = cursor.fetchall()
    conn.close()

    config = {}
    for row in rows:
      category, key, value, data_type = row
      if category not in config:
        config[category] = {}
      config[category][key] = self._cast_value(value, data_type)

    return config

  def get_category_config(self, category):
    """Get all configuration for a specific category"""
    conn = self.get_connection()
    cursor = conn.cursor()

    cursor.execute('''
                   SELECT key, value, data_type FROM magnet_config
                   WHERE category = ?
                   ORDER BY key
                   ''', (category,))

    rows = cursor.fetchall()
    conn.close()

    return {row[0]: self._cast_value(row[1], row[2]) for row in rows}

  def _cast_value(self, value, data_type):
    """Cast string value to appropriate type"""
    if data_type == 'int':
      return int(value)
    elif data_type == 'float':
      return float(value)
    elif data_type == 'bool':
      return value.lower() in ('true', '1', 'yes', 'on')
    elif data_type == 'json':
      return json.loads(value)
    else:
      return value

  # Sensor readings methods
  def save_sensor_reading(self, data):
    """Save sensor reading to database"""
    conn = self.get_connection()
    cursor = conn.cursor()

    cursor.execute('''
                   INSERT INTO sensor_readings (data, timestamp)
                   VALUES (?, CURRENT_TIMESTAMP)
                   ''', (json.dumps(data),))

    conn.commit()
    conn.close()

  def get_recent_readings(self, limit=100):
    """Get recent sensor readings"""
    conn = self.get_connection()
    cursor = conn.cursor()

    cursor.execute('''
                   SELECT data, timestamp FROM sensor_readings
                   ORDER BY timestamp DESC LIMIT ?
                   ''', (limit,))

    rows = cursor.fetchall()
    conn.close()

    return [{'data': json.loads(row[0]), 'timestamp': row[1]} for row in rows]

  def cleanup_old_readings(self, days=7):
    """Delete readings older than specified days"""
    conn = self.get_connection()
    cursor = conn.cursor()

    cursor.execute('''
                   DELETE FROM sensor_readings
                   WHERE timestamp < datetime('now', '-' || ? || ' days')
                   ''', (days,))

    deleted = cursor.rowcount
    conn.commit()
    conn.close()

    return deleted

  # System logs methods
  def log(self, level, component, message):
    """Log a system message"""
    conn = self.get_connection()
    cursor = conn.cursor()

    cursor.execute('''
                   INSERT INTO system_logs (level, component, message, timestamp)
                   VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                   ''', (level, component, message))

    conn.commit()
    conn.close()

  def get_logs(self, limit=100, level=None, component=None):
    """Get system logs with optional filtering"""
    conn = self.get_connection()
    cursor = conn.cursor()

    query = 'SELECT level, component, message, timestamp FROM system_logs WHERE 1=1'
    params = []

    if level:
      query += ' AND level = ?'
      params.append(level)

    if component:
      query += ' AND component = ?'
      params.append(component)

    query += ' ORDER BY timestamp DESC LIMIT ?'
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]

  def cleanup_old_logs(self, days=7):
    """Delete logs older than specified days"""
    conn = self.get_connection()
    cursor = conn.cursor()

    cursor.execute('''
                   DELETE FROM system_logs
                   WHERE timestamp < datetime('now', '-' || ? || ' days')
                   ''', (days,))

    deleted = cursor.rowcount
    conn.commit()
    conn.close()

    return deleted

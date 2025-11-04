# config_manager.py
import json
import os

# config_manager.py
from database import Database

class Config:
    def __init__(self):
        self.db = Database()

    def get(self, *keys):
        """Get configuration value using dot notation"""
        if len(keys) == 2:
            category, key = keys
            return self.db.get_config(category, key)
        elif len(keys) == 1:
            # Get entire category
            return self.db.get_category_config(keys[0])
        else:
            raise ValueError("Invalid number of keys")

    def set(self, value, *keys, data_type=None, description=None):
        """Set configuration value"""
        if len(keys) != 2:
            raise ValueError("Must provide category and key")

        category, key = keys

        # Auto-detect data type if not provided
        if data_type is None:
            if isinstance(value, bool):
                data_type = 'bool'
            elif isinstance(value, int):
                data_type = 'int'
            elif isinstance(value, float):
                data_type = 'float'
            else:
                data_type = 'string'

        self.db.set_config(category, key, value, data_type, description)

    def get_all(self):
        """Get all configuration"""
        return self.db.get_all_config()
    


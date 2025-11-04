-- Migration: Add magnet monitor config initial data
INSERT INTO magnet_config (category, key, value, data_type, description, user_editable) VALUES ('serial', 'port', '/dev/ttyUSB0', 'string', 'Serial port device path', 1);
INSERT INTO magnet_config (category, key, value, data_type, description, user_editable) VALUES ('serial', 'baudrate', '9600', 'integer', 'Serial baudrate', 0);
INSERT INTO magnet_config (category, key, value, data_type, description, user_editable) VALUES ('serial', 'timeout', '1', 'integer', 'Serial timeout in seconds', 0);
INSERT INTO magnet_config (category, key, value, data_type, description, user_editable) VALUES ('serial', 'command', 'R', 'string', 'Command to send to magnet', 0);

-- MQTT configuration
INSERT INTO magnet_config (category, key, value, data_type, description, user_editable) VALUES ('mqtt', 'host', 'localhost', 'string', 'MQTT broker host', 0);
INSERT INTO magnet_config (category, key, value, data_type, description, user_editable) VALUES ('mqtt', 'port', '1883', 'integer', 'MQTT broker port', 0);
INSERT INTO magnet_config (category, key, value, data_type, description, user_editable) VALUES ('mqtt', 'topic', 'sensors/current', 'string', 'MQTT topic for sensor data', 0);

-- Display configuration
INSERT INTO magnet_config (category, key, value, data_type, description, user_editable) VALUES ('display', 'refresh_rate', '1', 'integer', 'Sensor reading interval in seconds', 0);

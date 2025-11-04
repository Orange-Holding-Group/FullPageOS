# serial_reader.py
import re
import serial
import json
import paho.mqtt.client as mqtt
import time
from datetime import datetime
from config_manager import Config
from dataclasses import dataclass, asdict
from magnet_logger import MagnetLogger

# --- Handle compatibility for CallbackAPIVersion (v2.x feature) ---
try:
  from paho.mqtt.client import CallbackAPIVersion
  USE_NEW_API = True
except ImportError:
  CallbackAPIVersion = None
  USE_NEW_API = False

# ====================================================
# 🔧 1. Data Model
# ====================================================

@dataclass
class MagnetState:
  sm_magnet_supervisory: str = ""
  sm_unknown_var_1: str = ""
  sm_field_current: str = ""
  sm_field_current_time: str = ""
  sm_supervisory_time: str = ""
  sm_msup_serial_number: str = "00000000"
  sm_msup_rev: str = "0000"
  sm_magnet_serial_number: str = "00000"
  sm_magnet_rev: str = "0000"
  sm_he_params: str = ""
  sm_he_level_1: str = ""
  sm_he_level_2: str = ""
  sm_he_status: str = ""
  sm_eis: str = ""
  sm_self_test: str = ""
  sm_battery_status: str = ""
  sm_sh: str = ""
  sm_volts: str = ""
  sm_pressure_heater_status: str = ""
  sm_pressure_heater_value: str = ""
  sm_unknown_var_2: str = ""
  sm_compressor: str = ""
  sm_cold_head_sensor_1: str = ""
  sm_shield_sensor_1: str = ""
  sm_shield_sensor_2: str = ""
  sm_shield_status: str = ""
  sm_turret_sensor_1: str = ""
  sm_turret_sensor_2: str = ""
  sm_turret_status: str = ""
  sm_carbon_r_sensor_1: str = ""
  sm_carbon_r_sensor_2: str = ""
  sm_carbon_r_sensor_1_2_status: str = ""
  sm_carbon_r_sensor_3: str = ""
  sm_carbon_r_sensor_4: str = ""
  sm_carbon_r_sensor_3_4_status: str = ""
  sm_swt_heater_r_1: str = ""
  sm_swt_heater_r_status: str = ""
  sm_quh_heater_r_1: str = ""
  sm_quh_heater_r_2: str = ""
  sm_quh_heater_r_status: str = ""
  sm_magnet_psi_a: str = ""
  sm_magnet_psi_a_status: str = ""
  sm_avg_power: str = ""
  sm_avg_power_status: str = ""
  sm_erdu: str = ""
  sm_tests: str = ""
  sm_datetime: str = ""


# ====================================================
# 🔧 2. LV100 Cursor Mapping
# ====================================================

POS_MAP = {
  (2, 22): "sm_magnet_supervisory",
  (3, 0): "sm_unknown_var_1",
  (3, 16): "sm_field_current",
  (3, 38): "sm_field_current_time",
  (4, 20): "sm_supervisory_time",
  (5, 11): "sm_msup_serial_number",
  (5, 24): "sm_msup_rev",
  (5, 40): "sm_magnet_serial_number",
  (5, 50): "sm_magnet_rev",
  (7, 17): "sm_he_params",
  (7, 41): "sm_he_level_1",
  (7, 48): "sm_he_level_2",
  (8, 6): "sm_he_status",
  (8, 37): "sm_eis",
  (9, 37): "sm_self_test",
  (10, 11): "sm_battery_status",
  (10, 37): "sm_sh",
  (11, 11): "sm_volts",
  (11, 37): "sm_pressure_heater_status",
  (11, 41): "sm_pressure_heater_value",
  (12, 1): "sm_unknown_var_2",
  (12, 37): "sm_compressor",
  (13, 20): "sm_cold_head_sensor_1",
  (14, 20): "sm_shield_sensor_1",
  (14, 36): "sm_shield_sensor_2",
  (14, 44): "sm_shield_status",
  (15, 20): "sm_turret_sensor_1",
  (15, 36): "sm_turret_sensor_2",
  (15, 44): "sm_turret_status",
  (16, 20): "sm_carbon_r_sensor_1",
  (16, 36): "sm_carbon_r_sensor_2",
  (16, 44): "sm_carbon_r_sensor_1_2_status",
  (17, 20): "sm_carbon_r_sensor_3",
  (17, 36): "sm_carbon_r_sensor_4",
  (17, 44): "sm_carbon_r_sensor_3_4_status",
  (18, 20): "sm_swt_heater_r_1",
  (18, 44): "sm_swt_heater_r_status",
  (19, 20): "sm_quh_heater_r_1",
  (19, 36): "sm_quh_heater_r_2",
  (19, 44): "sm_quh_heater_r_status",
  (20, 20): "sm_magnet_psi_a",
  (20, 44): "sm_magnet_psi_a_status",
  (21, 20): "sm_avg_power",
  (21, 44): "sm_avg_power_status",
  (22, 21): "sm_erdu",
  (23, 10): "sm_tests",
}


# ====================================================
# 🔧 3. LV100 Parser
# ====================================================
LV100_PATTERN = re.compile(r'\x1b\[(\d+);(\d+)H((?:(?!\x1b\[\d+;\d+H).)*)')
# logger = MagnetLogger()

def parse_siemens_lv100_line(line: str, state: MagnetState):
  """Parse one LV100 stream chunk and update the state."""
  # print(f"Parsing line: {repr(line)}")  # Debug raw line
  for match in LV100_PATTERN.finditer(line):
    row, col = int(match.group(1)), int(match.group(2))
    raw_value = match.group(3)
    # Remove all ANSI color/control codes
    clean_value = re.sub(r'\x1b\[[0-9;]*[A-Za-z]', '', raw_value)
    clean_value = clean_value.strip()
    if (row, col) in POS_MAP:
      # print(f"Matched at ({row},{col}): '{raw_value}' -> '{clean_value}'")  # Debug match
      field = POS_MAP[(row, col)]
      setattr(state, field, clean_value)
  # print(f"Updated state: {state}")  # Debug updated state
  return state

def start_reader():
  print(f"Using serial port: 4")
  config = Config()

  # Load serial config
  port = config.get('serial', 'port')
  baudrate = config.get('serial', 'baudrate')
  timeout = config.get('serial', 'timeout')
  command = config.get('serial', 'command')

  # Load MQTT config
  mqtt_host = config.get('mqtt', 'host')
  mqtt_port = config.get('mqtt', 'port')
  mqtt_topic = config.get('mqtt', 'topic')

  # Local monitor config
  publish_interval = config.get('display', 'refresh_rate')
  while True:
    try:
      print(f"Connecting to {port}")
      # Setup serial
      ser = serial.Serial(port,
                          baudrate,
                          timeout=timeout,
                          bytesize=serial.EIGHTBITS,
                          parity=serial.PARITY_NONE,
                          stopbits=serial.STOPBITS_ONE,
                          xonxoff=False,  # or True if required
                          rtscts=False,
                          dsrdtr=False
                          )
      print(f"Connected to {port}")

      # Setup MQTT
      if USE_NEW_API:  # v2.x syntax
        mqtt_client = mqtt.Client(CallbackAPIVersion.VERSION2, "Publisher")
      else:  # v1.x syntax (no CallbackAPIVersion available)
        mqtt_client = mqtt.Client()
      # mqtt_client = mqtt.Client(CallbackAPIVersion.VERSION2, "Publisher")
      mqtt_client.connect(mqtt_host, mqtt_port, 60)

      print(f"MQTT INIATIALIZED {mqtt_host}:{mqtt_port} TOPIC: {mqtt_topic}")

      # clean screen
      # ser.write(b'\x1b')  # ESC = ASCII 27
      # ser.flush()

      last_publish = time.time()

      # Send command
      ser.write(f'{command}\n'.encode())

      magnet_record = MagnetState()

      while True:
        try:
          line = ser.readline().decode(errors='ignore').strip()
          if line:
            # logger.log(line)
            record = f"{line}\n"
            # print(f"Raw line: {repr(record)}")  # Debug raw line
            magnet_record = parse_siemens_lv100_line(record, magnet_record)
            magnet_record.sm_datetime = datetime.now().isoformat()

            now = time.time()
            if now - last_publish >= publish_interval:
              clean_values(magnet_record)
              mqtt_client.publish(mqtt_topic, json.dumps(asdict(magnet_record)), retain=True)
              print(f"[{datetime.now().strftime('%H:%M:%S')}] MQTT updated")
              last_publish = now
            # print("data source" + str(magnet_record))
            # time.sleep(config.get('display', 'refresh_rate'))
            # yield magnet_record
        except Exception as e:
          print(f"⚠️ Inner read error: {e}")
          time.sleep(1)  # brief pause before retrying

    except serial.SerialException as e:
      print(f"Serial error: {e}")
      # print("Available ports:", list_available_ports())
    except Exception as e:
      print(f"Error: {e}")
    print("Retrying connection in 5 seconds...")
    time.sleep(5)


def clean_values(state: MagnetState):
  state.sm_cold_head_sensor_1 = trim_and_remove_end(state.sm_cold_head_sensor_1)

  state.sm_shield_sensor_1 = trim_and_remove_end(state.sm_shield_sensor_1)
  state.sm_shield_sensor_2 = trim_and_remove_end(state.sm_shield_sensor_2)

  state.sm_turret_sensor_1 = trim_and_remove_end(state.sm_turret_sensor_1)
  state.sm_turret_sensor_2 = trim_and_remove_end(state.sm_turret_sensor_2)

  state.sm_carbon_r_sensor_1 = trim_and_remove_end(state.sm_carbon_r_sensor_1)
  state.sm_carbon_r_sensor_2 = trim_and_remove_end(state.sm_carbon_r_sensor_2)
  state.sm_carbon_r_sensor_3 = trim_and_remove_end(state.sm_carbon_r_sensor_3)
  state.sm_carbon_r_sensor_4 = trim_and_remove_end(state.sm_carbon_r_sensor_4)

  state.sm_swt_heater_r_1 = trim_and_remove_end(state.sm_swt_heater_r_1)

  state.sm_quh_heater_r_1 = trim_and_remove_end(state.sm_quh_heater_r_1)
  state.sm_quh_heater_r_2 = trim_and_remove_end(state.sm_quh_heater_r_2)

  state.sm_avg_power = trim_and_remove_end(state.sm_avg_power)

  state.sm_pressure_heater_value = trim_and_remove_end(state.sm_pressure_heater_value)


def trim_and_remove_end(value: str, remove_count: int = 1) -> str:
  if not value:
    return value

  value = value.strip()  # remove leading/trailing spaces

  if len(value) <= remove_count:
    return ""  # nothing left after removal

  return value[:-remove_count]


if __name__ == "__main__":
  start_reader()

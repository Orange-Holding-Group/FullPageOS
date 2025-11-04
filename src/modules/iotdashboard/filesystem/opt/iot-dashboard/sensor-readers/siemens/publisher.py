import paho.mqtt.client as mqtt
import time, json, random

broker = "localhost"
topic = "sensors/realtime"

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1, "raspi_publisher")
#client = mqtt.Client("raspi_publisher")
client.connect(broker)

while True:
    data = {
        "magnet_supervisory": "551-360 VA08P 23/06/17",
        "field_current": round(random.uniform(505, 515), 2),
        "field_current_time": time.strftime("%H:%M:%S %d-%b-%y")
    }
    client.publish(topic, json.dumps(data))
    print("Published:", data)
    time.sleep(2)

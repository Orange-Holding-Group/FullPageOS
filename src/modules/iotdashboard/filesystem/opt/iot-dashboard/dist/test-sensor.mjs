import mqtt from 'mqtt';

function generateRandomMagnetState() {
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randomFloat = (min, max, decimals = 2) =>
    (Math.random() * (max - min) + min).toFixed(decimals);

  const randomStatus = () =>
    ['OK', 'WARNING', 'ERROR', 'NORMAL', 'ABNORMAL'][randomInt(0, 4)];

  const randomSerialNumber = (length) =>
    Array.from({ length }, () => randomInt(0, 9)).join('');

  const randomDateTime = () => {
    const date = new Date(Date.now() - randomInt(0, 30 * 24 * 60 * 60 * 1000));
    return date.toISOString();
  };

  return {
    sm_magnet_supervisory: randomStatus(),
    sm_unknown_var_1: randomFloat(0, 100),
    sm_field_current: randomFloat(0, 500),
    sm_field_current_time: randomDateTime(),
    sm_supervisory_time: randomDateTime(),
    sm_msup_serial_number: randomSerialNumber(8),
    sm_msup_rev: randomSerialNumber(4),
    sm_magnet_serial_number: randomSerialNumber(5),
    sm_magnet_rev: randomSerialNumber(4),
    sm_he_params: randomFloat(0, 100),
    sm_he_level_1: randomFloat(0, 100),
    sm_he_level_2: randomFloat(0, 100),
    sm_he_status: randomStatus(),
    sm_eis: randomStatus(),
    sm_self_test: randomStatus(),
    sm_battery_status: `${randomInt(0, 100)}%`,
    sm_sh: randomFloat(0, 50),
    sm_volts: randomFloat(200, 240),
    sm_pressure_heater_status: randomStatus(),
    sm_pressure_heater_value: randomFloat(0, 100),
    sm_unknown_var_2: randomFloat(0, 100),
    sm_compressor: ['RUNNING', 'STOPPED', 'IDLE'][randomInt(0, 2)],
    sm_cold_head_sensor_1: randomFloat(-50, 50),
    sm_shield_sensor_1: randomFloat(-50, 50),
    sm_shield_sensor_2: randomFloat(-50, 50),
    sm_shield_status: randomStatus(),
    sm_turret_sensor_1: randomFloat(-50, 50),
    sm_turret_sensor_2: randomFloat(-50, 50),
    sm_turret_status: randomStatus(),
    sm_carbon_r_sensor_1: randomFloat(0, 1000),
    sm_carbon_r_sensor_2: randomFloat(0, 1000),
    sm_carbon_r_sensor_1_2_status: randomStatus(),
    sm_carbon_r_sensor_3: randomFloat(0, 1000),
    sm_carbon_r_sensor_4: randomFloat(0, 1000),
    sm_carbon_r_sensor_3_4_status: randomStatus(),
    sm_swt_heater_r_1: randomFloat(0, 100),
    sm_swt_heater_r_status: randomStatus(),
    sm_quh_heater_r_1: randomFloat(0, 100),
    sm_quh_heater_r_2: randomFloat(0, 100),
    sm_quh_heater_r_status: randomStatus(),
    sm_magnet_psi_a: randomFloat(15.27, 15.38),
    sm_magnet_psi_a_status: randomStatus(),
    sm_avg_power: randomFloat(0, 5000),
    sm_avg_power_status: randomStatus(),
    sm_erdu: randomStatus(),
    sm_tests: randomStatus(),
    sm_datetime: randomDateTime(),
  };
}

const client = mqtt.connect('mqtt://localhost:1883');
client.on('connect', () => {
  console.log('Test sensor connected');

  setInterval(() => {
    const magnetState = generateRandomMagnetState();

    client.publish('sensors/current', JSON.stringify(magnetState));

    console.log(`Published: MagnetState=${magnetState}`);
  }, 3000);
});

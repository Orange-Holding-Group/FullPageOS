import { SensorType, UserRole } from '../../config/constants';
import { Service, ServiceStatus } from '../services/systemService';
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: {
        message: string;
        stack?: string;
    };
    count?: number;
}
export interface IUser {
    id?: number;
    username: string;
    email: string;
    password?: string;
    role: UserRole;
    created_at?: string;
    updated_at?: string;
}
export interface IUserCreate {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
}
export interface IUserUpdate {
    username?: string;
    email?: string;
    role?: UserRole;
}
export interface ISensor {
    id?: number;
    type: SensorType;
    value: number;
    unit?: string;
    user_id?: number | null;
    timestamp?: string;
}
export interface ISensorCreate {
    type: SensorType;
    value: number;
    unit?: string;
    user_id?: number | null;
}
export interface ISensorReading<T = any> {
    sensorId: string;
    data: T;
    timestamp: string;
}
export interface IMQTTConfig {
    broker: {
        url: string;
        options: {
            clientId: string;
            clean: boolean;
            connectTimeout: number;
            username: string;
            password: string;
            reconnectPeriod: number;
        };
    };
    topics: {
        magnetState: string;
    };
}
export interface Migration {
    id: number;
    name: string;
    executed_at: string;
}
export interface MigrationFile {
    filename: string;
    path: string;
    executed: boolean;
}
export interface MagnetState {
    sm_magnet_supervisory: string;
    sm_unknown_var_1: string;
    sm_field_current: string;
    sm_field_current_time: string;
    sm_supervisory_time: string;
    sm_msup_serial_number: string;
    sm_msup_rev: string;
    sm_magnet_serial_number: string;
    sm_magnet_rev: string;
    sm_he_params: string;
    sm_he_level_1: string;
    sm_he_level_2: string;
    sm_he_status: string;
    sm_eis: string;
    sm_self_test: string;
    sm_battery_status: string;
    sm_sh: string;
    sm_volts: string;
    sm_pressure_heater_status: string;
    sm_pressure_heater_value: string;
    sm_unknown_var_2: string;
    sm_compressor: string;
    sm_cold_head_sensor_1: string;
    sm_shield_sensor_1: string;
    sm_shield_sensor_2: string;
    sm_shield_status: string;
    sm_turret_sensor_1: string;
    sm_turret_sensor_2: string;
    sm_turret_status: string;
    sm_carbon_r_sensor_1: string;
    sm_carbon_r_sensor_2: string;
    sm_carbon_r_sensor_1_2_status: string;
    sm_carbon_r_sensor_3: string;
    sm_carbon_r_sensor_4: string;
    sm_carbon_r_sensor_3_4_status: string;
    sm_swt_heater_r_1: string;
    sm_swt_heater_r_status: string;
    sm_quh_heater_r_1: string;
    sm_quh_heater_r_2: string;
    sm_quh_heater_r_status: string;
    sm_magnet_psi_a: string;
    sm_magnet_psi_a_status: string;
    sm_avg_power: string;
    sm_avg_power_status: string;
    sm_erdu: string;
    sm_tests: string;
    sm_datetime: string;
}
export interface IMagnetConfig {
    id: number;
    category: string;
    key: string;
    value: string;
    dataType: string;
    description: string;
    userEditable: boolean;
}
export interface IService {
    label: string;
    name: Service;
    description: string;
    status: ServiceStatus;
}
//# sourceMappingURL=index.d.ts.map
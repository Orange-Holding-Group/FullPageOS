import { IService } from '../types';
export declare class SystemService {
    findAll(): Promise<IService[]>;
    getServiceStatus(serviceName: string): Promise<ServiceStatus>;
    serviceAction(serviceName: Service, command: ServiceAction): Promise<void>;
}
export declare enum Service {
    iotSensorReader = "iot-sensor-reader.service",
    iotDashboard = "iot-dashboard.service"
}
export declare enum ServiceAction {
    start = "start",
    stop = "stop",
    restart = "restart"
}
export declare enum ServiceStatus {
    running = "running",
    stopped = "stopped",
    unknown = "unknown"
}
export declare const systemService: SystemService;
//# sourceMappingURL=systemService.d.ts.map
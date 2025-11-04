"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemService = exports.ServiceStatus = exports.ServiceAction = exports.Service = exports.SystemService = void 0;
const node_child_process_1 = require("node:child_process");
class SystemService {
    async findAll() {
        for (const service of services) {
            service.status = await this.getServiceStatus(service.name);
        }
        return services;
    }
    async getServiceStatus(serviceName) {
        return new Promise((resolve) => {
            (0, node_child_process_1.exec)(`sudo systemctl is-active ${serviceName}`, (error, stdout) => {
                const serviceStatus = stdout.trim();
                if (serviceStatus === 'active') {
                    resolve(ServiceStatus.running);
                }
                else if (serviceStatus === 'inactive') {
                    resolve(ServiceStatus.stopped);
                }
                else {
                    resolve(ServiceStatus.unknown);
                }
                if (error) {
                    resolve(ServiceStatus.unknown);
                }
            });
        });
    }
    async serviceAction(serviceName, command) {
        await executeCommand(serviceName, command);
    }
}
exports.SystemService = SystemService;
const executeCommand = (serviceName, command) => {
    return new Promise((resolve, reject) => {
        (0, node_child_process_1.exec)(`sudo systemctl ${command} ${serviceName}`, (error, stdout, stderr) => {
            if (error) {
                reject({ error: error.message, stderr });
                return;
            }
            resolve({ stdout, stderr });
        });
    });
};
var Service;
(function (Service) {
    Service["iotSensorReader"] = "iot-sensor-reader.service";
    Service["iotDashboard"] = "iot-dashboard.service";
})(Service || (exports.Service = Service = {}));
var ServiceAction;
(function (ServiceAction) {
    ServiceAction["start"] = "start";
    ServiceAction["stop"] = "stop";
    ServiceAction["restart"] = "restart";
})(ServiceAction || (exports.ServiceAction = ServiceAction = {}));
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["running"] = "running";
    ServiceStatus["stopped"] = "stopped";
    ServiceStatus["unknown"] = "unknown";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
const services = [
    {
        name: Service.iotSensorReader,
        label: 'Sensor Reader',
        description: 'Sensor Reader for IoT Dashboard',
        status: ServiceStatus.unknown,
    },
    {
        name: Service.iotDashboard,
        label: 'IoT Dashboard',
        description: 'IoT Dashboard App',
        status: ServiceStatus.unknown,
    },
];
exports.systemService = new SystemService();
//# sourceMappingURL=systemService.js.map
import { IMagnetConfig } from '../types';
export declare class MagnetConfigService {
    findAll(): Promise<IMagnetConfig[]>;
    updateConfig(magnetConfigs: IMagnetConfig[]): Promise<IMagnetConfig[]>;
}
export declare const magnetService: MagnetConfigService;
//# sourceMappingURL=magnetConfigService.d.ts.map
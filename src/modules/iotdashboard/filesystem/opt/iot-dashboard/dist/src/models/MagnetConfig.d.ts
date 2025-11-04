import { IMagnetConfig } from '../types';
export declare class MagnetConfig {
    static findAll(limit?: number): Promise<IMagnetConfig[]>;
    static update(id: number, magnetData: IMagnetConfig): Promise<IMagnetConfig | undefined>;
    static findById(id: number): Promise<IMagnetConfig | undefined>;
}
//# sourceMappingURL=MagnetConfig.d.ts.map
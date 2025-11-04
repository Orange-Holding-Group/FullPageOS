import { AnomalyData, EmailConfig, EmailResult } from '../email/types/email-types';
export declare class EmailService {
    private transporter;
    private config;
    constructor(config: EmailConfig);
    private initializeTransporter;
    sendAnomalyAlert(anomalyData: AnomalyData): Promise<EmailResult>;
}
//# sourceMappingURL=emailService.d.ts.map
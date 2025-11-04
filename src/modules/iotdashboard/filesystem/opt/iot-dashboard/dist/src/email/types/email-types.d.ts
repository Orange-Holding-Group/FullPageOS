export interface EmailConfig {
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
        tls: {
            ciphers: string;
            rejectUnauthorized: boolean;
        };
        requireTLS: boolean;
    };
    from: string;
    recipients: string;
    alertSubjectPrefix: string;
}
export interface MetricRule {
    stableValue: number;
    threshold: number;
}
export interface MetricData {
    name: string;
    value: string;
    stableValue: string;
    status: 'OK' | 'WARNING' | 'CRITICAL';
    unit?: string;
}
export interface AnomalyData {
    metrics: MetricData[];
    overallSeverity: 'WARNING' | 'CRITICAL';
    timestamp?: string;
    details?: string;
}
export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: Error;
}
//# sourceMappingURL=email-types.d.ts.map
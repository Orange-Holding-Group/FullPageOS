"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const anomaly_alert_template_1 = require("../email/templates/anomaly-alert.template");
class EmailService {
    constructor(config) {
        this.config = config;
        this.transporter = this.initializeTransporter();
    }
    initializeTransporter() {
        const transporter = nodemailer_1.default.createTransport(this.config.smtp);
        // Verify connection configuration
        transporter.verify((error) => {
            if (error) {
                console.error('Email service configuration error:', error);
            }
            else {
                console.log('Email service is ready to send messages');
            }
        });
        return transporter;
    }
    async sendAnomalyAlert(anomalyData) {
        const { overallSeverity, metrics } = anomalyData;
        const problemMetrics = metrics.filter((m) => m.status !== 'OK');
        const mailOptions = {
            from: this.config.from,
            to: this.config.recipients,
            subject: `${this.config.alertSubjectPrefix} - ${overallSeverity}: ${problemMetrics.length} Metric${problemMetrics.length !== 1 ? 's' : ''} Affected`,
            html: (0, anomaly_alert_template_1.generateEmailTemplate)(anomalyData),
            text: (0, anomaly_alert_template_1.generatePlainTextEmail)(anomalyData),
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Alert email sent successfully:', info.messageId);
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            console.error('Error sending alert email:', error);
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Unknown error'),
            };
        }
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=emailService.js.map
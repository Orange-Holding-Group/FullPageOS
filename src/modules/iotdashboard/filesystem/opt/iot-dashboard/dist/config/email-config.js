"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfig = void 0;
// src/config/email.config.ts
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.emailConfig = {
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.office365.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME || 'user',
            pass: process.env.SMTP_PASSWORD || 'user',
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: true,
        },
        requireTLS: true,
    },
    from: process.env.EMAIL_FROM || 'Monitor',
    recipients: process.env.EMAIL_RECIPIENTS || 'EMAIL_RECIPIENTS = user@email.com',
    alertSubjectPrefix: process.env.ALERT_SUBJECT_PREFIX || '🚨 Magnet Monitor Alert',
};
//# sourceMappingURL=email-config.js.map
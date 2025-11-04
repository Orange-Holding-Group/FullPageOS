"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePlainTextEmail = exports.generateEmailTemplate = void 0;
const getStatusColor = (status) => {
    switch (status) {
        case 'CRITICAL':
            return '#d32f2f';
        case 'WARNING':
            return '#f57c00';
        case 'OK':
            return '#388e3c';
        default:
            return '#757575';
    }
};
const generateMetricRows = (metrics) => {
    return metrics
        .map((metric) => {
        const statusColor = getStatusColor(metric.status);
        const statusIcon = metric.status === 'OK' ? '✓' : '⚠';
        const unit = metric.unit ? ` ${metric.unit}` : '';
        return `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 12px; font-weight: ${metric.status !== 'OK' ? 'bold' : 'normal'};">
          <span style="color: ${statusColor}; margin-right: 8px;">${statusIcon}</span>
          ${metric.name}
        </td>
        <td style="padding: 12px; text-align: center; color: ${metric.status !== 'OK' ? statusColor : '#333'};">
          ${metric.value}${unit}
        </td>
        <td style="padding: 12px; text-align: center;">
          ${metric.stableValue}${unit}
        </td>
        <td style="padding: 12px; text-align: center;">
          <span style="
            padding: 4px 8px;
            border-radius: 4px;
            background-color: ${statusColor}15;
            color: ${statusColor};
            font-weight: bold;
            font-size: 12px;
          ">
            ${metric.status}
          </span>
        </td>
      </tr>
    `;
    })
        .join('');
};
const generateEmailTemplate = (data) => {
    const { metrics, overallSeverity, timestamp, details } = data;
    const headerColor = overallSeverity === 'CRITICAL' ? '#d32f2f' : '#f57c00';
    const problemMetrics = metrics.filter((m) => m.status !== 'OK');
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header {
          background-color: ${headerColor};
          color: white;
          padding: 20px;
          border-radius: 5px 5px 0 0;
        }
        .header h2 { margin: 0; }
        .summary {
          background-color: #fff3cd;
          border-left: 4px solid ${headerColor};
          padding: 15px;
          margin: 20px 0;
        }
        .content { background-color: #f5f5f5; padding: 20px; border-radius: 0 0 5px 5px; }
        .metrics-table {
          width: 100%;
          background-color: white;
          border-collapse: collapse;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin: 20px 0;
        }
        .metrics-table th {
          background-color: #424242;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        .label { font-weight: bold; color: #555; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🚨 Magnet Monitor Alert - ${overallSeverity}</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">
            ${problemMetrics.length} metric${problemMetrics.length !== 1 ? 's' : ''}
            ${problemMetrics.length !== 1 ? 'have' : 'has'} exceeded threshold values
          </p>
        </div>
        <div class="content">
          <div class="summary">
            <p style="margin: 0;">
              <span class="label">Timestamp:</span> ${timestamp || new Date().toISOString()}
            </p>
            ${details ? `<p style="margin: 10px 0 0 0;"><span class="label">Details:</span> ${details}</p>` : ''}
          </div>

          <h3 style="margin-top: 0;">Metrics Status</h3>
          <table class="metrics-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th style="text-align: center;">Current Value</th>
                <th style="text-align: center;">Threshold</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${generateMetricRows(metrics)}
            </tbody>
          </table>

          <p style="margin-top: 20px;">
            <strong>Action Required:</strong> Please investigate the metrics marked as
            ${overallSeverity} as soon as possible.
          </p>
        </div>
        <div class="footer">
          <p>This is an automated alert from your Magnet Monitor system.</p>
          <p style="margin: 5px 0 0 0;">
            Legend: ✓ = Normal | ⚠ = Alert
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
exports.generateEmailTemplate = generateEmailTemplate;
const generatePlainTextEmail = (data) => {
    const { metrics, overallSeverity, timestamp, details } = data;
    const problemMetrics = metrics.filter((m) => m.status !== 'OK');
    const metricsText = metrics
        .map((metric) => {
        const unit = metric.unit ? ` ${metric.unit}` : '';
        const statusSymbol = metric.status === 'OK' ? '[OK]' : '[!]';
        return `${statusSymbol} ${metric.name}: ${metric.value}${unit} (Threshold: ${metric.stableValue}${unit}) - ${metric.status}`;
    })
        .join('\n');
    return `
MAGNET MONITOR ALERT - ${overallSeverity}

${problemMetrics.length} metric${problemMetrics.length !== 1 ? 's' : ''} ${problemMetrics.length !== 1 ? 'have' : 'has'} exceeded threshold values

Timestamp: ${timestamp || new Date().toISOString()}
${details ? `Details: ${details}\n` : ''}

METRICS STATUS:
${metricsText}

ACTION REQUIRED: Please investigate the metrics marked as ${overallSeverity} as soon as possible.

---
This is an automated alert from your Magnet Monitor system.
Legend: [OK] = Normal | [!] = Alert
  `;
};
exports.generatePlainTextEmail = generatePlainTextEmail;
//# sourceMappingURL=anomaly-alert.template.js.map
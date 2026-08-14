import fs from 'node:fs';
import path from 'node:path';
import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';
const serviceName = process.env.APP_NAME || 'service-boilerplate';
const isVercelRuntime = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
];

if (!isVercelRuntime) {
  const logsDir = path.resolve(process.cwd(), 'logs');

  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  transports.unshift(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    })
  );
}

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: serviceName },
  transports
});

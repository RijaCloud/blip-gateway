import dotenv from 'dotenv';
import path from 'path';

const serviceRoot = path.resolve(__dirname, '..', '..');
const appRoot = path.resolve(serviceRoot, '..');
const nodeEnv = process.env.NODE_ENV || 'development';

const loadEnvFile = (filePath: string, override = false) => {
  dotenv.config({ path: filePath, override });
};

loadEnvFile(path.join(serviceRoot, '.env'));
loadEnvFile(path.join(serviceRoot, `.env.${nodeEnv}`), true);
loadEnvFile(path.join(appRoot, '.env.local'), true);
loadEnvFile(path.join(serviceRoot, '.env.local'), true);

export const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const getNumberEnv = (name: string, fallback: number): number => {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

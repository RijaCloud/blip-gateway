import mongoose from 'mongoose';
import { getRequiredEnv } from './env';
import { logger } from '../utils/logger';

let isConnecting = false;

export const connectToMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return mongoose.connection;
  }

  isConnecting = true;

  try {
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(getRequiredEnv('MONGODB_URI'), {
      dbName: process.env.MONGODB_DB_NAME || undefined,
      serverSelectionTimeoutMS: 10000
    });

    logger.info('MongoDB connected', {
      host: connection.connection.host,
      database: connection.connection.name
    });

    return connection.connection;
  } finally {
    isConnecting = false;
  }
};

export const disconnectFromMongo = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
};

export const getMongoHealth = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  } as const;

  return {
    readyState: mongoose.connection.readyState,
    status: states[mongoose.connection.readyState as keyof typeof states] || 'unknown',
    database: mongoose.connection.name || null,
    host: mongoose.connection.host || null
  };
};

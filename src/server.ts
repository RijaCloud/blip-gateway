import './config/env';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createServer } from 'http';
import proxy from 'express-http-proxy';
import { getNumberEnv, getRequiredEnv } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimit';
import { requestLogger } from './middleware/requestLogger';
import healthRoutes from './routes/health';
import { ExampleSchedulerService } from './services/exampleSchedulerService';
import { logger } from './utils/logger';


const app = express();
const server = createServer(app);
const PORT = getNumberEnv('PORT', 3010);
const AUTH_SERVICE_URL = getRequiredEnv('AUTH_SERVICE_URL');
const trustProxySetting =
  process.env.TRUST_PROXY !== undefined
    ? process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1'
    : 1;

app.set('trust proxy', trustProxySetting);
app.disable('x-powered-by');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:3010',
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [])
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin non autorisee: ${origin}`));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Admin-API-Key']
};

app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  referrerPolicy: { policy: 'no-referrer' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], 
      scriptSrcAttr: ["'unsafe-inline'"],                    
      styleSrc: ["'self'", "'unsafe-inline'"],                 
      connectSrc: ["'self'", "http://localhost:8000", "ws://localhost:3010", "http://localhost:3010"], 
    },
  },
}));

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/health', healthRoutes);
app.use('/api/auth',generalLimiter, proxy(AUTH_SERVICE_URL, {
  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    return srcReq.body ? JSON.stringify(srcReq.body) : bodyContent;
  },
  proxyReqPathResolver: (req) => {
    const path = req.url.startsWith('/') ? req.url : `/${req.url}`;
    return `/api/auth${path}`;
  }
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/chat', proxy('http://localhost:3010', {
  proxyReqBodyDecorator: (bodyContent, srcReq) => {
    return srcReq.body ? JSON.stringify(srcReq.body) : bodyContent;
  },
  proxyReqPathResolver: (req) => {
    const path = req.url.startsWith('/') ? req.url : `/${req.url}`;
    return `/api/chat${path}`;
  }
}));

app.use(errorHandler);

const scheduler = new ExampleSchedulerService();
const bootstrap = async () => {
  server.listen(PORT, () => {
    logger.info('API Gateway started', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      allowedOrigins,
      authServiceUrl: AUTH_SERVICE_URL
    });
    scheduler.start();
  });
};

const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down API Gateway...`);
  scheduler.stop();
  server.close(async () => {
    process.exit(0);
  });
};

bootstrap().catch((error) => {
  logger.error('Unable to start API Gateway', {
    errorMessage: error instanceof Error ? error.message : 'Unknown error'
  });
  process.exit(1);
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
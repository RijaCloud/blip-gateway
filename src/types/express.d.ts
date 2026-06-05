import type { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: {
      type: 'api-key';
      identifier: string;
    };
    requestStartTime?: number;
  }
}

export type AuthenticatedRequest = Request;

import type { Request } from 'express';

export interface AppRequest extends Request {
  auth?: {
    type: 'api-key';
    identifier: string;
  };
  requestStartTime?: number;
}

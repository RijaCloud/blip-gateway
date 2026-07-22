export {};

declare global {
  namespace Express {
    interface Request {
      auth?: {
        type: 'api-key';
        identifier: string;
      };
      requestStartTime?: number;
    }
  }
}

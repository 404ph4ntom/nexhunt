import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  encryptionKey: process.env.ENCRYPTION_KEY,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10),
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx,txt,md,png,jpg,jpeg,gif,zip,json,sol,js,ts,html,css').split(','),
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  submissionRateLimitTtl: parseInt(process.env.SUBMISSION_RATE_LIMIT_TTL || '86400', 10),
  submissionRateLimitMax: parseInt(process.env.SUBMISSION_RATE_LIMIT_MAX || '10', 10),
}));


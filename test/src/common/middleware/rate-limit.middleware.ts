import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

const logger = new Logger('RateLimitMiddleware');

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;

const requestCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();

  const record = requestCounts.get(ip);

  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  record.count += 1;

  if (record.count > MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    logger.warn(`Rate limit exceeded for IP: ${ip}`);
    res.status(429).json({
      statusCode: 429,
      message: `Too many requests. Retry after ${retryAfter}s.`,
      error: 'Too Many Requests',
    });
    return;
  }

  next();
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class RateLimitGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const identifier = request.user?.id || request.ip;
    const endpoint = request.route?.path || request.url;
    const now = new Date();

    // Get rate limit config from request (can be set by middleware)
    const ttl = request.rateLimitTtl || 60; // seconds
    const max = request.rateLimitMax || 100;

    const windowStart = new Date(now.getTime() - ttl * 1000);

    // Clean old entries
    await prisma.rateLimit.deleteMany({
      where: {
        windowStart: {
          lt: windowStart,
        },
      },
    });

    // Count requests in current window
    const count = await prisma.rateLimit.count({
      where: {
        identifier,
        endpoint,
        windowStart: {
          gte: windowStart,
        },
      },
    });

    if (count >= max) {
      throw new HttpException(
        'Too many requests, please try again later',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Record this request
    await prisma.rateLimit.create({
      data: {
        identifier,
        endpoint,
        windowStart: now,
        count: 1,
      },
    });

    return true;
  }
}


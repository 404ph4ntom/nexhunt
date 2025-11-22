import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(
    action: AuditAction,
    resourceType: string,
    resourceId: string | null,
    userId: string | null,
    changes?: any,
    ipAddress?: string,
    userAgent?: string,
    metadata?: any,
  ) {
    return this.prisma.auditLog.create({
      data: {
        action,
        resourceType,
        resourceId,
        userId,
        changes: changes ? JSON.stringify(changes) : null,
        ipAddress,
        userAgent,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  }

  async findAll(
    resourceType?: string,
    userId?: string,
    action?: AuditAction,
    skip = 0,
    take = 50,
  ) {
    const where: any = {};

    if (resourceType) {
      where.resourceType = resourceType;
    }

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = action;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total, skip, take };
  }
}


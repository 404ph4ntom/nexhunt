import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [users, programs, submissions, reports, payouts] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.program.count(),
      this.prisma.submission.count(),
      this.prisma.report.count(),
      this.prisma.payout.count(),
    ]);

    const totalRewards = await this.prisma.payout.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'COMPLETED',
      },
    });

    const reportsByStatus = await this.prisma.report.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    return {
      users,
      programs,
      submissions,
      reports,
      payouts,
      totalRewards: totalRewards._sum.amount || 0,
      reportsByStatus,
    };
  }

  async verifyAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}


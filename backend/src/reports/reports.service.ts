import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportFilterDto } from './dto/report-filter.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: ReportFilterDto, userId?: string) {
    const where: any = {};

    if (filters.programId) {
      where.programId = filters.programId;
    }

    if (filters.hunterId) {
      where.hunterId = filters.hunterId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.severity) {
      where.severity = filters.severity;
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        include: {
          program: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          hunter: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
          submission: {
            select: {
              id: true,
              title: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.report.count({ where }),
    ]);

    return { reports, total, skip: filters.skip || 0, take: filters.take || 20 };
  }

  async findOne(id: string, userId?: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        program: true,
        hunter: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        submission: {
          include: {
            attachments: true,
          },
        },
        comments: {
          include: {
            submission: {
              select: {
                id: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Check access
    const hasAccess =
      report.hunterId === userId ||
      report.program.ownerId === userId ||
      (await this.isTeamMember(report.programId, userId || ''));

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this report');
    }

    return report;
  }

  async update(id: string, dto: UpdateReportDto, userId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        program: true,
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    // Only program team can update reports
    const isTeamMember =
      report.program.ownerId === userId ||
      (await this.isTeamMember(report.programId, userId));

    if (!isTeamMember) {
      throw new ForbiddenException('Only program team can update reports');
    }

    const updateData: any = { ...dto };

    if (dto.status === 'TRIAGED' && !report.triagedAt) {
      updateData.triagedAt = new Date();
      updateData.triagedBy = userId;
    }

    if (dto.status === 'RESOLVED' && !report.resolvedAt) {
      updateData.resolvedAt = new Date();
    }

    return this.prisma.report.update({
      where: { id },
      data: updateData,
      include: {
        program: true,
        hunter: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });
  }

  private async isTeamMember(programId: string, userId: string): Promise<boolean> {
    const teamMember = await this.prisma.teamMember.findUnique({
      where: {
        programId_userId: {
          programId,
          userId,
        },
      },
    });
    return !!teamMember;
  }
}


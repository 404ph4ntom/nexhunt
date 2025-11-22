import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramFilterDto } from './dto/program-filter.dto';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProgramDto, ownerId: string) {
    const slug = this.generateSlug(dto.name);

    return this.prisma.program.create({
      data: {
        ...dto,
        slug,
        ownerId,
        inScope: dto.inScope ? JSON.stringify(dto.inScope) : null,
        outOfScope: dto.outOfScope ? JSON.stringify(dto.outOfScope) : null,
        chains: dto.chains ? JSON.stringify(dto.chains) : null,
        assets: dto.assets ? JSON.stringify(dto.assets) : null,
        bountyTable: dto.bountyTable ? JSON.stringify(dto.bountyTable) : null,
        disclosureSettings: dto.disclosureSettings
          ? JSON.stringify(dto.disclosureSettings)
          : null,
        slaSettings: dto.slaSettings ? JSON.stringify(dto.slaSettings) : null,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });
  }

  async findAll(filters: ProgramFilterDto, userId?: string) {
    const where: any = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    // Only show public programs or programs user has access to
    if (!userId) {
      where.isPublic = true;
    } else {
      where.OR = [
        { isPublic: true },
        { ownerId: userId },
        {
          teamMembers: {
            some: {
              userId,
            },
          },
        },
      ];
    }

    const [programs, total] = await Promise.all([
      this.prisma.program.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.program.count({ where }),
    ]);

    return { programs, total, skip: filters.skip || 0, take: filters.take || 20 };
  }

  async findOne(id: string, userId?: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        teamMembers: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // Check access
    const hasAccess =
      program.isPublic ||
      program.ownerId === userId ||
      program.teamMembers.some((m) => m.userId === userId);

    if (!hasAccess && !userId) {
      throw new ForbiddenException('This program is private');
    }

    return program;
  }

  async update(id: string, dto: UpdateProgramDto, userId: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // Check if user is owner or admin
    if (program.ownerId !== userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException('Only program owner can update');
      }
    }

    const updateData: any = { ...dto };
    if (dto.inScope) updateData.inScope = JSON.stringify(dto.inScope);
    if (dto.outOfScope) updateData.outOfScope = JSON.stringify(dto.outOfScope);
    if (dto.chains) updateData.chains = JSON.stringify(dto.chains);
    if (dto.assets) updateData.assets = JSON.stringify(dto.assets);
    if (dto.bountyTable) updateData.bountyTable = JSON.stringify(dto.bountyTable);
    if (dto.disclosureSettings)
      updateData.disclosureSettings = JSON.stringify(dto.disclosureSettings);
    if (dto.slaSettings) updateData.slaSettings = JSON.stringify(dto.slaSettings);

    return this.prisma.program.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    if (program.ownerId !== userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException('Only program owner can delete');
      }
    }

    await this.prisma.program.delete({ where: { id } });
    return { message: 'Program deleted successfully' };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}


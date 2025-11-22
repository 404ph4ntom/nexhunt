import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { EmbeddingUtil } from '../common/utils/embedding.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialize OpenAI for embeddings
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (openaiKey) {
      EmbeddingUtil.initialize(openaiKey);
    }
  }

  async create(dto: CreateSubmissionDto, hunterId: string) {
    // Check if program exists and is active
    const program = await this.prisma.program.findUnique({
      where: { id: dto.programId },
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    if (program.status !== 'ACTIVE') {
      throw new BadRequestException('Program is not active');
    }

    // Check submission rate limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const submissionsToday = await this.prisma.submission.count({
      where: {
        hunterId,
        programId: dto.programId,
        createdAt: {
          gte: today,
        },
      },
    });

    const maxPerDay = this.configService.get<number>('app.submissionRateLimitMax') || 10;
    if (submissionsToday >= maxPerDay) {
      throw new BadRequestException(
        `Maximum ${maxPerDay} submissions per day for this program`,
      );
    }

    // Generate embedding for similarity detection
    const textForEmbedding = `${dto.title} ${dto.description}`.slice(0, 8000);
    let embedding: number[] | null = null;

    try {
      embedding = await EmbeddingUtil.generateEmbedding(textForEmbedding);
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      // Continue without embedding if OpenAI fails
    }

    // Create submission
    const submission = await this.prisma.submission.create({
      data: {
        ...dto,
        hunterId,
        // Note: Prisma doesn't support vector types directly in TypeScript
        // You'll need to handle embeddings separately or use raw SQL
      },
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
      },
    });

    // Check for similar submissions (if embedding was generated)
    if (embedding) {
      // TODO: Implement similarity search using pgvector
      // This would require raw SQL query to compare embeddings
    }

    // Create report from submission
    await this.prisma.report.create({
      data: {
        submissionId: submission.id,
        programId: dto.programId,
        hunterId,
        title: dto.title,
        content: dto.description,
        severity: dto.severity,
      },
    });

    return submission;
  }

  async findAll(programId?: string, hunterId?: string, status?: string, skip = 0, take = 20) {
    const where: any = {};

    if (programId) {
      where.programId = programId;
    }

    if (hunterId) {
      where.hunterId = hunterId;
    }

    if (status) {
      where.status = status;
    }

    const [submissions, total] = await Promise.all([
      this.prisma.submission.findMany({
        where,
        skip,
        take,
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
          _count: {
            select: {
              attachments: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.submission.count({ where }),
    ]);

    return { submissions, total, skip, take };
  }

  async findOne(id: string, userId?: string) {
    const submission = await this.prisma.submission.findUnique({
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
        attachments: true,
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
        report: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check access - hunter can see their own, program team can see all
    const hasAccess =
      submission.hunterId === userId ||
      submission.program.ownerId === userId ||
      (await this.isTeamMember(submission.programId, userId || ''));

    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this submission');
    }

    return submission;
  }

  async update(id: string, dto: UpdateSubmissionDto, userId: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        program: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Only hunter can update their submission (before triaging)
    if (submission.hunterId !== userId) {
      throw new ForbiddenException('You can only update your own submissions');
    }

    if (submission.status !== 'NEW') {
      throw new BadRequestException('Cannot update triaged submissions');
    }

    return this.prisma.submission.update({
      where: { id },
      data: dto,
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


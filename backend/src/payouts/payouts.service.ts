import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { ProcessPayoutDto } from './dto/process-payout.dto';
import { EncryptionUtil } from '../common/utils/encryption.util';

@Injectable()
export class PayoutsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async create(dto: CreatePayoutDto, userId: string) {
    // Check if report exists and is resolved
    const report = await this.prisma.report.findUnique({
      where: { id: dto.reportId },
      include: {
        hunter: true,
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status !== 'RESOLVED') {
      throw new BadRequestException('Report must be resolved before payout');
    }

    // Check if payout already exists
    const existingPayout = await this.prisma.payout.findUnique({
      where: { reportId: dto.reportId },
    });

    if (existingPayout) {
      throw new BadRequestException('Payout already exists for this report');
    }

    // Encrypt payment details
    const encryptionKey = this.configService.get<string>('app.encryptionKey');
    if (!encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    const encryptedDetails = dto.paymentDetails
      ? EncryptionUtil.encrypt(JSON.stringify(dto.paymentDetails), encryptionKey)
      : null;

    return this.prisma.payout.create({
      data: {
        reportId: dto.reportId,
        hunterId: report.hunterId,
        amount: dto.amount,
        currency: dto.currency,
        method: dto.method,
        paymentDetails: encryptedDetails,
        fromAddress: dto.fromAddress,
        toAddress: dto.toAddress,
      },
      include: {
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

  async findAll(userId?: string, status?: string, skip = 0, take = 20) {
    const where: any = {};

    if (userId) {
      where.hunterId = userId;
    }

    if (status) {
      where.status = status;
    }

    const [payouts, total] = await Promise.all([
      this.prisma.payout.findMany({
        where,
        skip,
        take,
        include: {
          hunter: {
            select: {
              id: true,
              username: true,
              displayName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payout.count({ where }),
    ]);

    return { payouts, total, skip, take };
  }

  async findOne(id: string, userId?: string) {
    const payout = await this.prisma.payout.findUnique({
      where: { id },
      include: {
        hunter: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
    });

    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    // Only hunter or admin can view payout
    if (payout.hunterId !== userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId || '' },
      });
      if (user?.role !== 'ADMIN') {
        throw new ForbiddenException('You do not have access to this payout');
      }
    }

    return payout;
  }

  async process(id: string, dto: ProcessPayoutDto, userId: string) {
    const payout = await this.prisma.payout.findUnique({
      where: { id },
    });

    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    // Only admins can process payouts
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can process payouts');
    }

    if (payout.status !== 'PENDING') {
      throw new BadRequestException('Payout is not in pending status');
    }

    // Update payout with transaction details
    return this.prisma.payout.update({
      where: { id },
      data: {
        status: dto.status,
        transactionHash: dto.transactionHash,
        chainId: dto.chainId,
        processorId: dto.processorId,
        processedAt: new Date(),
        notes: dto.notes,
      },
      include: {
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
}


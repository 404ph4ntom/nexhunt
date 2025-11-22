import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { SiweMessage } from 'siwe';

// SIWE Strategy - simplified implementation without passport-custom
@Injectable()
export class SiweStrategy {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validate(message: string, signature: string, nonce?: string): Promise<any> {
    try {
      const siweMessage = new SiweMessage(message);
      const fields = await siweMessage.validate(signature);

      if (
        (nonce && fields.nonce !== nonce) ||
        fields.domain !== this.configService.get('SIWE_DOMAIN')
      ) {
        throw new UnauthorizedException('Invalid SIWE message');
      }

      // Find or create user
      let user = await this.prisma.user.findUnique({
        where: { walletAddress: fields.address.toLowerCase() },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            walletAddress: fields.address.toLowerCase(),
            username: `wallet_${fields.address.slice(0, 8)}`,
            displayName: `Wallet ${fields.address.slice(0, 6)}...${fields.address.slice(-4)}`,
          },
        });
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('SIWE validation failed');
    }
  }
}


import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        reputation: true,
        createdAt: true,
      },
    });
  }

  async findAll(skip = 0, take = 20) {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          avatar: true,
          role: true,
          reputation: true,
          totalRewards: true,
          createdAt: true,
        },
        orderBy: { reputation: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total, skip, take };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        role: true,
        reputation: true,
        totalRewards: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUserId: string) {
    // Only allow users to update their own profile or admins
    if (id !== currentUserId) {
      const currentUser = await this.prisma.user.findUnique({
        where: { id: currentUserId },
      });
      if (currentUser?.role !== 'ADMIN') {
        throw new ForbiddenException('You can only update your own profile');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}


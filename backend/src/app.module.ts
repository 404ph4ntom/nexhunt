import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import s3Config from './config/s3.config';
import redisConfig from './config/redis.config';
import appConfig from './config/app.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProgramsModule } from './programs/programs.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ReportsModule } from './reports/reports.module';
import { PayoutsModule } from './payouts/payouts.module';
import { FilesModule } from './files/files.module';
import { AuditModule } from './audit/audit.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, s3Config, redisConfig, appConfig],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UsersModule,
    ProgramsModule,
    SubmissionsModule,
    ReportsModule,
    PayoutsModule,
    FilesModule,
    AuditModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}


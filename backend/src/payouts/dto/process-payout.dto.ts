import { IsEnum, IsOptional, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PayoutStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class ProcessPayoutDto {
  @ApiProperty({ enum: PayoutStatus })
  @IsEnum(PayoutStatus)
  status: PayoutStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionHash?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  chainId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  processorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}


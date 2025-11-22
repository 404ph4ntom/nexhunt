import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsObject,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PayoutMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreatePayoutDto {
  @ApiProperty()
  @IsString()
  reportId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty({ enum: PayoutMethod })
  @IsEnum(PayoutMethod)
  method: PayoutMethod;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  paymentDetails?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fromAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  toAddress?: string;
}


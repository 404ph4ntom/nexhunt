import { IsEnum, IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus, Severity } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateReportDto {
  @ApiProperty({ enum: ReportStatus, required: false })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiProperty({ enum: Severity, required: false })
  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rewardAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rewardCurrency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDuplicate?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  duplicateOf?: string;
}


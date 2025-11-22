import { IsEnum, IsOptional, IsInt, Min, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus, Severity } from '@prisma/client';
import { Type } from 'class-transformer';

export class ReportFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  programId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hunterId?: string;

  @ApiProperty({ enum: ReportStatus, required: false })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiProperty({ enum: Severity, required: false })
  @IsOptional()
  @IsEnum(Severity)
  severity?: Severity;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;
}


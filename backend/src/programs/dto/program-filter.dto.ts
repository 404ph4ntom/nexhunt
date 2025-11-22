import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProgramType, ProgramStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class ProgramFilterDto {
  @ApiProperty({ enum: ProgramType, required: false })
  @IsOptional()
  @IsEnum(ProgramType)
  type?: ProgramType;

  @ApiProperty({ enum: ProgramStatus, required: false })
  @IsOptional()
  @IsEnum(ProgramStatus)
  status?: ProgramStatus;

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


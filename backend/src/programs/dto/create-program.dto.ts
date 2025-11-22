import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProgramType, ProgramStatus } from '@prisma/client';

export class CreateProgramDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ProgramType })
  @IsEnum(ProgramType)
  type: ProgramType;

  @ApiProperty({ enum: ProgramStatus, required: false })
  @IsOptional()
  @IsEnum(ProgramStatus)
  status?: ProgramStatus;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  discord?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  inScope?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  outOfScope?: string[];

  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  chains?: number[];

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  assets?: Record<string, any>;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  bountyTable?: Record<string, any>;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  disclosureSettings?: Record<string, any>;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  slaSettings?: Record<string, any>;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  allowPrivateReports?: boolean;
}


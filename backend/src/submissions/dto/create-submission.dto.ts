import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Severity } from '@prisma/client';

export class CreateSubmissionDto {
  @ApiProperty()
  @IsString()
  programId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: Severity })
  @IsEnum(Severity)
  severity: Severity;

  @ApiProperty({ required: false, minimum: 0, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  cvssScore?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cvssVector?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  affectedContract?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  chainId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionHash?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  proofOfConcept?: string;
}


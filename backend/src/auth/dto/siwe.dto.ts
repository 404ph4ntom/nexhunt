import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SiweDto {
  @ApiProperty({ example: '0x...' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: '0x...' })
  @IsString()
  @IsNotEmpty()
  signature: string;
}


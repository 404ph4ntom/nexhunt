import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { ProcessPayoutDto } from './dto/process-payout.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('payouts')
@Controller('payouts')
@ApiBearerAuth()
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROGRAM_OWNER)
  @ApiOperation({ summary: 'Create a new payout' })
  create(@Body() dto: CreatePayoutDto, @CurrentUser() user: any) {
    return this.payoutsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payouts' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  findAll(
    @Query('status') status?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @CurrentUser() user?: any,
  ) {
    return this.payoutsService.findAll(
      user?.id,
      status,
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 20,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payout by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.payoutsService.findOne(id, user?.id);
  }

  @Patch(':id/process')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Process payout (Admin only)' })
  process(
    @Param('id') id: string,
    @Body() dto: ProcessPayoutDto,
    @CurrentUser() user: any,
  ) {
    return this.payoutsService.process(id, dto, user.id);
  }
}


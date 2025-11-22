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
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new submission' })
  create(@Body() dto: CreateSubmissionDto, @CurrentUser() user: any) {
    return this.submissionsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all submissions' })
  @ApiQuery({ name: 'programId', required: false })
  @ApiQuery({ name: 'hunterId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  findAll(
    @Query('programId') programId?: string,
    @Query('hunterId') hunterId?: string,
    @Query('status') status?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.submissionsService.findAll(
      programId,
      hunterId,
      status,
      skip ? parseInt(skip, 10) : 0,
      take ? parseInt(take, 10) : 20,
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get submission by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.submissionsService.findOne(id, user?.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update submission' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSubmissionDto,
    @CurrentUser() user: any,
  ) {
    return this.submissionsService.update(id, dto, user.id);
  }
}


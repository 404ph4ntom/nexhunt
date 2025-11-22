import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { ProgramFilterDto } from './dto/program-filter.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new program' })
  create(@Body() dto: CreateProgramDto, @CurrentUser() user: any) {
    return this.programsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all programs' })
  findAll(@Query() filters: ProgramFilterDto, @CurrentUser() user?: any) {
    return this.programsService.findAll(filters, user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get program by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.programsService.findOne(id, user?.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update program' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProgramDto,
    @CurrentUser() user: any,
  ) {
    return this.programsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete program' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.programsService.remove(id, user.id);
  }
}


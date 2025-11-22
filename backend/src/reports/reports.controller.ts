import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportFilterDto } from './dto/report-filter.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reports' })
  findAll(@Query() filters: ReportFilterDto, @CurrentUser() user?: any) {
    return this.reportsService.findAll(filters, user?.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get report by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.reportsService.findOne(id, user?.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update report' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
    @CurrentUser() user: any,
  ) {
    return this.reportsService.update(id, dto, user.id);
  }
}


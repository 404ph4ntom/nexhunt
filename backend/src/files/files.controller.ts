import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('files')
@Controller('files')
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/:submissionId')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a file to a submission' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Param('submissionId') submissionId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.filesService.uploadFile(file, submissionId, user.id);
  }

  @Get(':id/url')
  @ApiOperation({ summary: 'Get file download URL' })
  async getFileUrl(@Param('id') id: string, @CurrentUser() user: any) {
    return this.filesService.getFileUrl(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a file' })
  async deleteFile(@Param('id') id: string, @CurrentUser() user: any) {
    return this.filesService.deleteFile(id, user.id);
  }
}


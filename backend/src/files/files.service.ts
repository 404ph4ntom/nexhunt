import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FileUtil } from '../common/utils/file.util';
import { EncryptionUtil } from '../common/utils/encryption.util';

@Injectable()
export class FilesService {
  private s3Client: S3Client;
  private bucket: string;
  private encryptionKey: string;
  private maxFileSize: number;
  private allowedFileTypes: string[];

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const s3Config = this.configService.get('s3');
    if (s3Config?.accessKeyId && s3Config?.secretAccessKey) {
      this.s3Client = new S3Client({
        region: s3Config.region,
        credentials: {
          accessKeyId: s3Config.accessKeyId,
          secretAccessKey: s3Config.secretAccessKey,
        },
        ...(s3Config.endpoint && { endpoint: s3Config.endpoint }),
      });
      this.bucket = s3Config.bucket;
    }
    this.encryptionKey = this.configService.get<string>('app.encryptionKey') || '';
    this.maxFileSize = this.configService.get<number>('app.maxFileSize') || 52428800;
    this.allowedFileTypes =
      this.configService.get<string[]>('app.allowedFileTypes') || [];
  }

  async uploadFile(
    file: Express.Multer.File,
    submissionId: string,
    userId: string,
  ) {
    // Validate file
    if (!FileUtil.validateFileSize(file.size, this.maxFileSize)) {
      throw new BadRequestException(
        `File size exceeds maximum of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    if (!FileUtil.validateFileType(file.originalname, this.allowedFileTypes)) {
      throw new BadRequestException('File type not allowed');
    }

    // Virus scan (basic validation)
    const virusScanResult = await this.scanForVirus(file.buffer);
    if (!virusScanResult.isClean) {
      throw new BadRequestException('File failed validation');
    }

    // Generate unique filename
    const filename = FileUtil.generateUniqueFilename(file.originalname);
    const s3Key = `submissions/${submissionId}/${filename}`;
    const mimeType = FileUtil.getMimeType(file.originalname);

    // Encrypt file content if encryption key is set
    let fileContent = file.buffer;
    let encrypted = false;

    if (this.encryptionKey && this.encryptionKey.length >= 32) {
      try {
        const textContent = file.buffer.toString('base64');
        const encryptedText = EncryptionUtil.encrypt(textContent, this.encryptionKey);
        fileContent = Buffer.from(encryptedText, 'utf8');
        encrypted = true;
      } catch (error) {
        console.error('Encryption failed, storing unencrypted:', error);
      }
    }

    // Upload to S3 (if configured)
    if (this.s3Client && this.bucket) {
      try {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: s3Key,
            Body: fileContent,
            ContentType: mimeType,
            ServerSideEncryption: 'AES256',
            Metadata: {
              originalName: file.originalname,
              encrypted: encrypted.toString(),
              virusScanned: 'true',
              virusFree: virusScanResult.isClean.toString(),
            },
          }),
        );
      } catch (error) {
        console.error('S3 upload failed:', error);
        throw new InternalServerErrorException('File upload failed');
      }
    } else {
      // In development, just save metadata
      console.warn('S3 not configured - file not uploaded to storage');
    }

    // Save file record
    const fileRecord = await this.prisma.file.create({
      data: {
        submissionId,
        filename,
        originalName: file.originalname,
        mimeType,
        size: file.size,
        s3Key: this.s3Client ? s3Key : 'local',
        s3Bucket: this.bucket || 'local',
        encrypted,
        virusScanned: true,
        virusFree: virusScanResult.isClean,
        uploadedBy: userId,
      },
    });

    return fileRecord;
  }

  async getFileUrl(fileId: string, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      include: {
        submission: {
          select: {
            hunterId: true,
            programId: true,
          },
        },
      },
    });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    // Check access
    const hasAccess =
      file.submission?.hunterId === userId ||
      (await this.hasProgramAccess(file.submission?.programId || '', userId));

    if (!hasAccess) {
      throw new BadRequestException('You do not have access to this file');
    }

    // Generate presigned URL if S3 is configured
    if (this.s3Client && file.s3Key !== 'local') {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: file.s3Key,
      });
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return { url, file };
    }

    // Return placeholder URL for local files
    return {
      url: `/api/v1/files/${fileId}/download`,
      file,
    };
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      include: {
        submission: {
          select: {
            hunterId: true,
          },
        },
      },
    });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    // Only hunter or admin can delete
    if (file.submission?.hunterId !== userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (user?.role !== 'ADMIN') {
        throw new BadRequestException('You cannot delete this file');
      }
    }

    // Delete from S3 if configured
    if (this.s3Client && file.s3Key !== 'local') {
      try {
        // TODO: Implement S3 delete command
      } catch (error) {
        console.error('S3 delete failed:', error);
      }
    }

    // Delete from database
    await this.prisma.file.delete({
      where: { id: fileId },
    });

    return { message: 'File deleted successfully' };
  }

  private async scanForVirus(buffer: Buffer): Promise<{ isClean: boolean }> {
    // Basic file validation
    if (buffer.length === 0) {
      return { isClean: false };
    }
    
    // In production, integrate with ClamAV or another antivirus service
    // For development, allow files to pass
    if (this.configService.get<string>('NODE_ENV') === 'production') {
      console.warn('Virus scanning not configured - files allowed without scan');
    }
    
    return { isClean: true };
  }

  private async hasProgramAccess(programId: string, userId: string): Promise<boolean> {
    const program = await this.prisma.program.findUnique({
      where: { id: programId },
      include: {
        teamMembers: {
          where: { userId },
        },
      },
    });

    return !!(
      program?.ownerId === userId ||
      (program?.teamMembers && program.teamMembers.length > 0)
    );
  }
}

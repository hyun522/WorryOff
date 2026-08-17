import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express';

@Controller('images')
export class AppController {
  private readonly supabase: SupabaseClient;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createClient(
      this.configService.getOrThrow<string>('SUPABASE_URL'),
      this.configService.getOrThrow<string>('SUPABASE_SECRET_KEY'),
    );
    this.bucket = this.configService.getOrThrow<string>('SUPABASE_BUCKET');
  }

  /**
   * POST /images/upload
   * multer + memoryStorage로 파일을 버퍼로 받아 Supabase Storage에 업로드하고
   * 저장된 파일명만 JSON으로 반환한다. (전체 URL 아님)
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/)) {
          callback(
            new BadRequestException('이미지 파일만 업로드할 수 있습니다.'),
            false,
          );
          return;
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB 제한
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

    // Date.now() + 랜덤값 + 원본 확장자로 고유한 파일명 생성
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}${extname(file.originalname)}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) {
      throw new InternalServerErrorException('이미지 업로드에 실패했어요.');
    }

    return { fileName };
  }

  /**
   * GET /images/:filename
   * Supabase Storage의 공개 URL로 302 리다이렉트한다.
   */
  @Get(':filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    // 상위 경로 접근(경로 조작) 방지
    if (
      filename.includes('..') ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      throw new BadRequestException('잘못된 파일명입니다.');
    }

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filename);

    return res.redirect(data.publicUrl);
  }
}

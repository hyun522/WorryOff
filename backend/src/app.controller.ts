import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';

@Controller('images')
export class AppController {
  /**
   * POST /images/upload
   * multer + diskStorage로 이미지를 ./uploads 폴더에 저장하고
   * 저장된 파일명만 JSON으로 반환한다. (전체 URL 아님)
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          // Date.now() + 랜덤값 + 원본 확장자로 고유한 파일명 생성
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
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
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('업로드할 파일이 없습니다.');
    }

    return { fileName: file.filename };
  }

  /**
   * GET /images/:filename
   * ./uploads 폴더에 저장된 실제 이미지 파일을 그대로 응답한다.
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

    const filePath = join(process.cwd(), 'uploads', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('파일을 찾을 수 없습니다.');
    }

    return res.sendFile(filePath);
  }
}

import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  // 업로드 폴더가 없으면 서버 시작 시점에 미리 생성해둔다.
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const app = await NestFactory.create(AppModule);

  // 외부 프론트엔드(다른 오리진)에서도 자유롭게 호출할 수 있도록 CORS 전면 허용
  app.enableCors({
    origin: '*',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Image upload server is running on http://localhost:${port}`);
}
bootstrap();

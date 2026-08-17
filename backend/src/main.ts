import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
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

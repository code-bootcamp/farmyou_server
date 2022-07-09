// 오홍 깃 너무 어려워
import { NestFactory } from '@nestjs/core';
//배포할때
import { AppModule } from './app.module';
//로컬로테스트 진행시
import { AppModuleTest } from './app.moduletest';


async function bootstrap() {
  const app = await NestFactory.create(AppModuleTest);
  await app.listen(3000);
}
bootstrap();

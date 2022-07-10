// 오홍 깃 너무 어려워
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
//배포할때
import { AppModule } from './app.module';
//로컬로테스트 진행시
import { AppModuleTest } from './app.moduletest';


async function bootstrap() {
  const app = await NestFactory.create(AppModuleTest);
  // 이미지 업로드 하는데 사용 하기 위해 넣음
  app.use(graphqlUploadExpress())
  await app.listen(3000);
}
bootstrap();

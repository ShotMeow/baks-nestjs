import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3001);

  return 3001;
}
bootstrap().then((port) => console.log(`Server running at ${port}`));

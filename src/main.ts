import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useStaticAssets({
    root: path.join(__dirname, '../storage/images/'),
    prefix: '/images/',
  });

  app.enableCors();
  await app.register(multipart);
  await app.listen(3001);

  return 3001;
}
bootstrap().then((port) => console.log(`Server running at ${port}`));

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import * as path from 'path';

const PORT = process.env.SERVER_PORT || 3001;
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
  await app.listen(PORT, '0.0.0.0');

  return app.getUrl();
}
bootstrap().then((url) => console.log(`Server running at ${url}`));

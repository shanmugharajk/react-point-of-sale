import * as compression from 'compression';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  const validationPipe = new ValidationPipe({
    whitelist: true,
    transform: true,
    dismissDefaultMessages: false,
    validationError: { target: false },
  });

  app.enable('trust proxy');
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(validationPipe);

  await app.listen(port, () =>
    console.log(`\n== NestJS powered server is running at ${port}==\n`),
  );
}

try {
  bootstrap();
} catch (error) {
  console.log(error);
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Auth example')
    .setDescription('The Auth API description')
    .setVersion('1.0')
    .addTag('Auth')
    .addBearerAuth()
    .build();

  app.setGlobalPrefix('api');
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);
  app.use(helmet());
  app.enableCors({
    origin: configService.get<string>('ALLOWED_ORIGIN'), // Specify the exact origin
    credentials: true, // Allow credentials
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
  });
  app.use(compression());
  await app.listen(3000);
}
bootstrap();

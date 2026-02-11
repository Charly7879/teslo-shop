import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Logger de Nestjs
  const logger = new Logger('bootstrap');

  // Prefix
  app.setGlobalPrefix('api');

  // Validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Permitir campos sólo del dto
      forbidNonWhitelisted: true, // Mensaje que la propiedad no está permitida
      transform: true, // Transformar los datos en tipos Ej: number, string, boolean, etc
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`App runing on port ${process.env.PORT}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      // Allow localhost and any vercel app
      if (origin.includes('localhost') || origin.includes('vercel.app') || origin === env.clientUrl) {
        return callback(null, true);
      }
      callback(null, true); // Fallback: allow all for this assignment, but can be restricted later.
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}))

  await app.listen(env.port ?? 3000);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/env';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('RAW ENV:', JSON.stringify({
    PORT: process.env.PORT,
    DATABASE_URL: !!process.env.DATABASE_URL,
    REDIS_URL: !!process.env.REDIS_URL,
  }));

  app.enableCors({
    origin:["https://suntek-ai-round-2.vercel.app", "http://localhost:3001"],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}))

  await app.listen(process.env.PORT ?? 3000,"0.0.0.0",()=>{console.log("Server running")});
}

bootstrap();

import { spawn } from 'node:child_process';
import path from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { assertProductionConfig, getCorsOrigins } from './config/production';

function runMigrations(): Promise<void> {
  return new Promise((resolve, reject) => {
    const prismaCli = path.join(
      process.cwd(),
      'node_modules/prisma/build/index.js',
    );
    const child = spawn(process.execPath, [prismaCli, 'migrate', 'deploy'], {
      env: process.env,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`prisma migrate deploy exited with code ${code}`));
    });
  });
}

async function bootstrap() {
  const port = Number(process.env.PORT ?? 8080);
  console.log('Starting API', {
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL?.trim()),
    hasJwtSecret: Boolean(process.env.JWT_SECRET?.trim()),
    frontendUrl: process.env.FRONTEND_URL ?? '(missing)',
    port,
  });

  assertProductionConfig();

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.enableShutdownHooks();
  await app.listen(port, '0.0.0.0');
  console.log(`API listening on 0.0.0.0:${port}`);

  try {
    await runMigrations();
    console.log('Prisma migrations applied');
  } catch (error) {
    console.error('Prisma migrate deploy failed', error);
  }
}

void bootstrap();

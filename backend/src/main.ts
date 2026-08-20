import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
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

function listen(server: http.Server, port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onError = (error: Error) => {
      server.off('error', onError);
      reject(error);
    };
    server.once('error', onError);
    server.listen(port, '0.0.0.0', () => {
      server.off('error', onError);
      resolve();
    });
  });
}

async function bootstrap() {
  const port = Number(process.env.PORT ?? 8080);
  const expressApp = express();

  expressApp.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'shramasa-api' });
  });

  const server = http.createServer(expressApp);
  await listen(server, port);
  console.log(`API listening on 0.0.0.0:${port}`);

  try {
    console.log('Starting Nest', {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL?.trim()),
      hasJwtSecret: Boolean(process.env.JWT_SECRET?.trim()),
      frontendUrl: process.env.FRONTEND_URL ?? '(missing)',
      port,
    });

    assertProductionConfig();

    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
      { rawBody: true },
    );

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
    await app.init();
    console.log('Nest application ready');

    await runMigrations();
    console.log('Prisma migrations applied');
  } catch (error) {
    console.error('API failed after binding /health', error);
  }
}

void bootstrap();

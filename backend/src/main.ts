import { spawn } from 'node:child_process';
import path from 'node:path';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Pool } from 'pg';
import { AppModule } from './app.module';
import { assertProductionConfig, getCorsOrigins } from './config/production';

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: process.env,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

function runMigrations(): Promise<void> {
  const prismaCli = path.join(
    process.cwd(),
    'node_modules/prisma/build/index.js',
  );
  return runCommand(process.execPath, [prismaCli, 'migrate', 'deploy']);
}

async function countProducts(): Promise<number> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return 0;
  }

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    const result = await pool.query<{ c: number }>('SELECT COUNT(*)::int AS c FROM "Product"');
    return result.rows[0]?.c ?? 0;
  } finally {
    await pool.end();
  }
}

async function seedCatalogIfEmpty(): Promise<void> {
  const existing = await countProducts();
  if (existing > 0) {
    console.log(`Catalog already has ${existing} products`);
    return;
  }

  const tsxBin = path.join(process.cwd(), 'node_modules/.bin/tsx');
  console.log('Empty catalog — running seed');
  await runCommand(tsxBin, ['prisma/seed.ts']);
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
    await seedCatalogIfEmpty();
  } catch (error) {
    console.error('Prisma migrate/seed failed', error);
  }
}

void bootstrap();

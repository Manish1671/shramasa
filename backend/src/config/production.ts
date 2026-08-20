function isWeakJwtSecret(secret: string): boolean {
  const normalized = secret.trim().toLowerCase();
  return (
    secret.trim().length < 32 ||
    normalized.includes('change-me') ||
    normalized.includes('replace-with') ||
    normalized.includes('local-dev')
  );
}

function expandOrigin(origin: string): string[] {
  try {
    const url = new URL(origin);
    const origins = new Set<string>([url.origin]);

    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      origins.add(url.origin);
    } else if (url.hostname.includes('.')) {
      url.hostname = `www.${url.hostname}`;
      origins.add(url.origin);
    }

    return [...origins];
  } catch {
    return [origin];
  }
}

export function getCorsOrigins(): string[] {
  const configured = [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_URLS,
  ]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(','))
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)
    .flatMap(expandOrigin);

  if (process.env.NODE_ENV !== 'production') {
    configured.push('http://localhost:3000');
  }

  return [...new Set(configured)];
}

export function assertProductionConfig(): void {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL is required in production');
  }

  const jwtSecret = process.env.JWT_SECRET ?? '';
  if (isWeakJwtSecret(jwtSecret)) {
    throw new Error(
      'JWT_SECRET must be a unique value of at least 32 characters in production',
    );
  }

  const frontendUrl = process.env.FRONTEND_URL?.trim() ?? '';
  if (!frontendUrl.startsWith('https://')) {
    throw new Error(
      'FRONTEND_URL must be the https storefront origin in production',
    );
  }
}

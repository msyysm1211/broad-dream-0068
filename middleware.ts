import { NextResponse, type NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

// 必须使用 Node 运行时，Edge 运行时无法访问 fs 进行文件落盘
export const config = {
  runtime: 'nodejs',
  // 排除静态资源，避免噪音；如需观测可移除
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map)$).*)',
  ],
};

// 敏感请求头脱敏
const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'proxy-authorization',
]);

function pickHeaders(req: NextRequest): Record<string, string> {
  const out: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    out[key] = SENSITIVE_HEADERS.has(key.toLowerCase()) ? '***' : value;
  });
  return out;
}

function pickQuery(req: NextRequest): Record<string, string> {
  const out: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export function middleware(req: NextRequest) {
  const start = Date.now();
  const requestId =
    req.headers.get('x-request-id') ||
    (globalThis.crypto?.randomUUID?.() ?? `${start}-${Math.random().toString(36).slice(2, 10)}`);

  logger.info('http_request', {
    requestId,
    method: req.method,
    url: req.nextUrl.pathname + req.nextUrl.search,
    path: req.nextUrl.pathname,
    query: pickQuery(req),
    headers: pickHeaders(req),
    ip: getClientIp(req),
    ua: req.headers.get('user-agent') || '',
    referer: req.headers.get('referer') || '',
    host: req.headers.get('host') || '',
  });

  // 透传 request-id，便于业务代码记录同一条链路
  const res = NextResponse.next({
    request: { headers: new Headers(req.headers) },
  });
  res.headers.set('x-request-id', requestId);

  // middleware 阶段无法直接拿到响应状态码，仅记录耗时
  const duration = Date.now() - start;
  logger.debug('http_middleware_done', { requestId, durationMs: duration });

  return res;
}

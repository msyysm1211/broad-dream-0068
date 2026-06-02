import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  const requestId = request.headers.get('x-request-id') || undefined;
  logger.info('health_check', { requestId });
  console.log('[health] 普通 console.log 也会进 stdout 与文件（经 logger 时）');

  return NextResponse.json({
    status: 'ok',
    nextVersion: 15,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 统一日志工具：同时输出 stdout/stderr 与 Pod 内文件
 *
 * 环境变量：
 *   LOG_LEVEL    debug | info | warn | error  （默认 info）
 *   LOG_TO_FILE  true | false                （默认 true）
 *   LOG_DIR      日志目录                     （默认 /var/log/app，不可写时回退到 ./logs）
 *   LOG_FILE     日志文件名                   （默认 app.log）
 *   SERVICE_NAME 服务名，用于日志字段          （默认 next-app）
 *
 * 仅在 Node.js 运行时生效（middleware 需声明 runtime: 'nodejs'）。
 */

import { appendFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_WEIGHT: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const CURRENT_LEVEL: Level =
  (process.env.LOG_LEVEL as Level) in LEVEL_WEIGHT
    ? (process.env.LOG_LEVEL as Level)
    : 'info';

const SERVICE_NAME = process.env.SERVICE_NAME || 'next-app';
const LOG_TO_FILE = (process.env.LOG_TO_FILE ?? 'true') !== 'false';
const DEFAULT_DIR = process.env.LOG_DIR || '/var/log/app';
const FALLBACK_DIR = path.resolve(process.cwd(), 'logs');
const LOG_FILE = process.env.LOG_FILE || 'app.log';

let resolvedFilePath: string | null = null;
let initPromise: Promise<void> | null = null;

async function ensureDir(dir: string): Promise<boolean> {
  try {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    return true;
  } catch {
    return false;
  }
}

async function initFileSink(): Promise<void> {
  if (!LOG_TO_FILE) return;
  if (await ensureDir(DEFAULT_DIR)) {
    resolvedFilePath = path.join(DEFAULT_DIR, LOG_FILE);
    return;
  }
  if (await ensureDir(FALLBACK_DIR)) {
    resolvedFilePath = path.join(FALLBACK_DIR, LOG_FILE);
    // eslint-disable-next-line no-console
    console.warn(
      `[logger] LOG_DIR=${DEFAULT_DIR} 不可写，已回退到 ${FALLBACK_DIR}`
    );
    return;
  }
  // eslint-disable-next-line no-console
  console.warn('[logger] 文件日志初始化失败，仅输出到 stdout');
}

function ensureInit(): Promise<void> {
  if (!initPromise) initPromise = initFileSink();
  return initPromise;
}

function shouldLog(level: Level): boolean {
  return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[CURRENT_LEVEL];
}

interface LogPayload {
  level: Level;
  msg: string;
  [key: string]: unknown;
}

function format(payload: LogPayload): string {
  return JSON.stringify({
    time: new Date().toISOString(),
    service: SERVICE_NAME,
    pid: process.pid,
    ...payload,
  });
}

async function writeFileLine(line: string): Promise<void> {
  await ensureInit();
  if (!resolvedFilePath) return;
  try {
    await appendFile(resolvedFilePath, line + '\n', 'utf8');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[logger] 写文件失败', err);
  }
}

function emit(level: Level, msg: string, fields: Record<string, unknown> = {}): void {
  if (!shouldLog(level)) return;
  const line = format({ level, msg, ...fields });
  // 1. stdout / stderr：kubectl logs 直接可见
  if (level === 'error' || level === 'warn') {
    // eslint-disable-next-line no-console
    console.error(line);
  } else {
    // eslint-disable-next-line no-console
    console.log(line);
  }
  // 2. 文件落盘：异步 fire-and-forget，不阻塞请求
  if (LOG_TO_FILE) {
    void writeFileLine(line);
  }
}

export const logger = {
  debug: (msg: string, fields?: Record<string, unknown>) => emit('debug', msg, fields),
  info: (msg: string, fields?: Record<string, unknown>) => emit('info', msg, fields),
  warn: (msg: string, fields?: Record<string, unknown>) => emit('warn', msg, fields),
  error: (msg: string, fields?: Record<string, unknown>) => emit('error', msg, fields),
};

export type Logger = typeof logger;

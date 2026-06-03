/**
 * Next.js 启动钩子：在 Node.js 运行时一启动就加载 logger，
 * 确保全局 console 劫持在任何业务代码、第三方库执行前生效。
 * 仅在 Node.js 运行时执行（Edge 运行时无 fs，无需也不能加载）。
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('@/lib/logger');
  }
}

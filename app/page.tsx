import { createHash } from 'crypto';

export const revalidate = 10;

export default function Home() {
  const envVars = {
    ESA_CACHE_GW_GATEWAY_ENDPOINT: process.env.ESA_CACHE_GW_GATEWAY_ENDPOINT ?? '未设置',
    ESA_CACHE_GW_AUTH_KEY: process.env.ESA_CACHE_GW_AUTH_KEY ?? '未设置',
    ESA_CACHE_GW_ALIUID: process.env.ESA_CACHE_GW_ALIUID ?? '未设置',
    ESA_CACHE_GW_ROUTINENAME: process.env.ESA_CACHE_GW_ROUTINENAME ?? '未设置',
    ESA_CACHE_GW_VERSION: process.env.ESA_CACHE_GW_VERSION ?? '未设置',
  };

  const authKey = process.env.ESA_CACHE_GW_AUTH_KEY ?? '';
  const aliuid = process.env.ESA_CACHE_GW_ALIUID ?? '';
  const routinename = process.env.ESA_CACHE_GW_ROUTINENAME ?? '';
  const version = process.env.ESA_CACHE_GW_VERSION ?? '';
  const expires = Math.floor(Date.now() / 1000) + 3600; // 当前时间 +1h

  const md5Hash = createHash('md5')
    .update(`${authKey}${expires}${aliuid}${routinename}${version}`)
    .digest('hex');

  return (
    <main style={{ padding: "2rem" }}>
      <h1>测试4！！！ 首页 (ISR — revalidate: 60s)</h1>
      <p>Next.js 15 + React 19</p>
      <p>构建时间: {new Date().toISOString()}</p>
      <p>本页面测试通过 Gateway OSS proxy 的 incremental cache 读写路径。</p>

      <section
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "#f5f5f5",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ margin: "0 0 1rem" }}>ESA Cache Gateway 环境变量</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ccc" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>变量名</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>说明</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>值</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>ESA_CACHE_GW_GATEWAY_ENDPOINT</td>
              <td style={{ padding: "0.5rem" }}>Gateway 服务地址</td>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>{envVars.ESA_CACHE_GW_GATEWAY_ENDPOINT}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>ESA_CACHE_GW_AUTH_KEY</td>
              <td style={{ padding: "0.5rem" }}>已派生的 authKey（HMAC-SHA256）</td>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>{envVars.ESA_CACHE_GW_AUTH_KEY}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>ESA_CACHE_GW_ALIUID</td>
              <td style={{ padding: "0.5rem" }}>用户 UID</td>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>{envVars.ESA_CACHE_GW_ALIUID}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>ESA_CACHE_GW_ROUTINENAME</td>
              <td style={{ padding: "0.5rem" }}>Routine 名称</td>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>{envVars.ESA_CACHE_GW_ROUTINENAME}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>ESA_CACHE_GW_VERSION</td>
              <td style={{ padding: "0.5rem" }}>版本号</td>
              <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>{envVars.ESA_CACHE_GW_VERSION}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "#fff8e1",
          borderRadius: "8px",
          border: "1px solid #ffe082",
        }}
      >
        <h2 style={{ margin: "0 0 1rem" }}>MD5 Hash 计算结果</h2>
        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          公式: <code>md5(authKey + expires + aliuid + routinename + version)</code>
        </p>
        <p style={{ margin: "0.5rem 0" }}>
          <strong>expires:</strong> <code>{expires}</code>
        </p>
        <p style={{ margin: "0.5rem 0" }}>
          <strong>拼接字符串:</strong> <code style={{ wordBreak: "break-all" }}>{`${authKey}${expires}${aliuid}${routinename}${version}`}</code>
        </p>
        <p style={{ margin: "0.5rem 0" }}>
          <strong>MD5 Hash:</strong>{" "}
          <code style={{ background: "#fff", padding: "0.25rem 0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}>
            {md5Hash}
          </code>
        </p>
      </section>

      <section
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          background: "#f0f7ff",
          borderRadius: "8px",
          border: "1px solid #b3d4fc",
        }}
      >
        <h2 style={{ margin: "0 0 1rem" }}>功能演示列表</h2>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <a href="/revalidate-demo">
              <strong>Revalidate Tag / Path 演示</strong>
            </a>{" "}
            — 测试 revalidateTag 和 revalidatePath 的按需刷新
          </li>
          <li>
            <a href="/blog">Blog (ISR)</a> — 测试 incremental cache + tag 关联
          </li>
          <li>
            <a href="/dynamic">Dynamic (SSR)</a> — 每次请求都重新渲染
          </li>
          <li>
            <a href="/ppr-test">PPR / Streaming</a> — Suspense streaming 测试
          </li>
          <li>
            <a href="/image-test">Image 优化</a> — 图片优化测试
          </li>
        </ul>
      </section>
    </main>
  );
}

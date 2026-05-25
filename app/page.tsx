import Image from 'next/image'
import Counter from './Counter'

export const revalidate = 5

export default function Home() {
  const renderedAt = new Date().toISOString()

  return (
    <main className="container">
      <div>
        <a href="https://nextjs.org" target="_blank" rel="noreferrer">
          <Image
            src="/next.svg"
            className="logo"
            alt="Next.js logo"
            width={180}
            height={120}
            priority
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <Image
            src="/react.svg"
            className="logo react"
            alt="React logo"
            width={120}
            height={120}
            priority
          />
        </a>
      </div>
      <h1>Next.js + React</h1>
      <Counter />
      <p className="read-the-docs">
        Click on the Next.js and React logos to learn more
      </p>
      <div className="isr-badge">
        ISR rendered at: {renderedAt} (revalidate: {revalidate}s)
      </div>
    </main>
  )
}

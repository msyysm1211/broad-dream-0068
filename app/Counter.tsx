'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="card">
      <button onClick={() => setCount((c) => c + 1)}>
        count is {count}
      </button>
      <p>
        Edit <code>app/page.tsx</code> and save to test HMR
      </p>
    </div>
  )
}

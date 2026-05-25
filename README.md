# Next.js + React + TypeScript (ISR)

This project was migrated from Vite to [Next.js](https://nextjs.org) (App Router) with **ISR (Incremental Static Regeneration)** enabled.

## ISR

`app/page.tsx` exports `revalidate = 5`, so the page is statically generated at build time and re-generated in the background **every 5 seconds** when a request comes in. Open the page and refresh: the `ISR rendered at` timestamp updates roughly every 5 seconds.

```ts
// app/page.tsx
export const revalidate = 5
```

## Scripts

```bash
npm install      # install deps
npm run dev      # start dev server on http://localhost:3000
npm run build    # production build
npm run start    # run the production build
npm run lint     # lint
```

## Project structure

```
app/
  layout.tsx     # root layout
  page.tsx       # ISR page (revalidate: 5s)
  Counter.tsx    # client component (useState)
  globals.css    # global styles
public/          # static assets
next.config.ts   # Next.js config
```

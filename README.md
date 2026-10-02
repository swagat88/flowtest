# Best of Best India

The arena where India votes on the best. Back your favorites. Watch the leaderboard move in real-time.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Database:** PostgreSQL (Neon) via Prisma
- **Cache/Queues:** Redis + BullMQ
- **Payments:** Razorpay
- **Realtime:** Ably
- **Styling:** TailwindCSS + Framer Motion
- **Moderation:** OpenAI

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL (or Neon account)
- Redis

### Setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open http://localhost:3000

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed launch data |
| `npm run db:studio` | Prisma Studio |

## Project Structure

```
app/
  (hub)/page.tsx            Hub landing with active arenas
  c/[slug]/page.tsx         Category board page
  api/
    hub/route.ts            Hub JSON API
    c/[slug]/route.ts       Category API
    c/[slug]/bid/route.ts   Bid placement
    c/[slug]/payment/create/route.ts  Razorpay order
    webhooks/razorpay/route.ts        Payment webhooks
    admin/moderation/route.ts         Moderation actions
lib/
  db.ts        Prisma client
  redis.ts     ioredis client
  cache.ts     Cache + Cloudflare purge
  razorpay.ts  Razorpay client + webhook verify
  queue/       BullMQ queues
components/
  arena-card.tsx
  category-board.tsx
  bid-modal.tsx
  live-feed.tsx
prisma/
  schema.prisma
  seed.ts
```

## Database Schema

Key models: `Category`, `Season`, `Listing`, `Bid`, `Ledger` (append-only), `WebhookEvent`, `BoardSnapshot`, `ModerationReview`, `Notification`, `Report`.

The ledger is append-only — every bid and payment event is recorded as an immutable row.

## Environment

See `.env.example` for all required variables. Notable:

- `DATABASE_URL` — Neon PostgreSQL connection string
- `REDIS_URL` — Redis for BullMQ queues
- `RAZORPAY_*` — Payment gateway
- `ABLY_API_KEY` / `NEXT_PUBLIC_ABLY_KEY` — Realtime channels
- `OPENAI_API_KEY` — Moderation

## Launch Categories (seeded)

1. AI Tools
2. Best Meme Pages
3. Instagram Creator Maharashtra

Each launches with Season 1 (60 days).

# TokenMeter

AI cost tracking and optimization for OpenAI and Anthropic APIs.

## Features

- 📊 **Real-time cost tracking** - See exactly what every API call costs
- 💡 **Optimization suggestions** - Get tips to reduce your AI spend
- ⚡ **Zero latency impact** - Edge-deployed proxy adds <1ms
- 🔔 **Budget alerts** - Get notified before you blow your budget
- 🔒 **Secure** - Your API keys are encrypted, requests are never stored long-term

## Quick Start

### 1. Get your TokenMeter API key

Sign up at [tokenmeter.com](https://tokenmeter.com) and create an API key.

### 2. Change one line

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://tokenmeter.com/api/v1/openai",
    default_headers={"X-TokenMeter-Key": "tm_your_key_here"}
)

# Use as normal - that's it!
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### 3. View your dashboard

See your costs, token usage, and optimization opportunities at [tokenmeter.com/dashboard](https://tokenmeter.com/dashboard).

## Development

### Prerequisites

- Node.js 18+
- PostgreSQL (we recommend [Neon](https://neon.tech))
- [Clerk](https://clerk.com) account for auth

### Setup

1. Clone the repo:
```bash
git clone https://github.com/toreyjames/TokenMeter.git
cd TokenMeter
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key

5. Push the database schema:
```bash
npm run db:push
```

6. Start the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon) + Drizzle ORM
- **Auth**: Clerk
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Deployment**: Vercel

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

The proxy endpoints use Vercel Edge Functions for minimal latency.

## API Reference

### Proxy Endpoints

- `POST /api/v1/openai/*` - Proxy for OpenAI API
- `POST /api/v1/anthropic/*` - Proxy for Anthropic API

### Response Headers

Every proxied response includes:

| Header | Description |
|--------|-------------|
| `X-TokenMeter-Cost-Cents` | Cost in cents |
| `X-TokenMeter-Input-Tokens` | Input token count |
| `X-TokenMeter-Output-Tokens` | Output token count |
| `X-TokenMeter-Latency-Ms` | Request latency in ms |

## License

MIT

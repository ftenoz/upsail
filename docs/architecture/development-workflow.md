# Development Workflow

## Local Development Setup

**Prerequisites**
```bash
node -v   # >= 20.x
npm -v    # >= 10.x
```

**Initial Setup**
```bash
npm install
```

**Development Commands**
```bash
# Start all services
npm run dev

# Start frontend only
npm run dev:web

# Start backend only
npm run dev:api

# Run tests
npm run test
```

## Environment Configuration

**Required Environment Variables**
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/upsail
JWT_SECRET=changeme

# Shared
NODE_ENV=development
```

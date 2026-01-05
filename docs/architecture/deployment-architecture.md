# Deployment Architecture

## Deployment Strategy
**Frontend Deployment:**
- **Platform:** Heroku (web app)
- **Build Command:** `npm run build:web`
- **Start Command:** `npm run start:web`
- **Output Directory:** `.next`
- **CDN/Edge:** Heroku default (no edge CDN); optional later via Cloudflare

**Backend Deployment:**
- **Platform:** Heroku (api app)
- **Build Command:** `npm run build:api`
- **Start Command:** `npm run start:api`
- **Health Check:** `GET /health`
- **Deployment Method:** Long-running Node service

**Database:**
- **Platform:** Heroku Postgres
- **Migrations:** `npm run migrate:deploy` (tool TBD)

## CI/CD Pipeline
```yaml
name: CI
on:
  push:
    branches: [main]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run test
      - run: npm run build
```

## Environments
| Environment | Frontend URL | Backend URL | Purpose |
| --- | --- | --- | --- |
| Development | http://localhost:3000 | http://localhost:4000 | Local development |
| Staging | https://staging-<app>.herokuapp.com | https://staging-<api>.herokuapp.com | Pre-production testing |
| Production | https://<app>.herokuapp.com | https://<api>.herokuapp.com | Live environment |

# Upsail

Baseline monorepo for the Upsail web and API applications.

## Workspace scripts
- `npm run build:web`
- `npm run start:web`
- `npm run build:api`
- `npm run start:api`
- `npm run test`

## Apps
- Web: `apps/web`
- API: `apps/api`
- Shared: `packages/shared`

## Deployment notes
- Configure `CORS_ORIGIN` for the API to allow the web app origin (comma-separated list). Example: `http://localhost:3000,https://upsail-web-591ee107d7d1.herokuapp.com`.


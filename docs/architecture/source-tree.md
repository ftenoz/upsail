# Source Tree

This document describes the expected repository layout and key locations to implement story 1.1.

```plaintext
upsail2/
  .github/
    workflows/
      ci.yaml
      deploy.yaml
  apps/
    web/
      src/
        app/
          (public)/
            page.tsx
        components/
        features/
        services/
        hooks/
        styles/
      public/
      tests/
        pages/
      package.json
    api/
      src/
        modules/
          health/
            health.controller.ts
            health.module.ts
        common/
        main.ts
        app.module.ts
      tests/
        integration/
      package.json
  packages/
    shared/
      src/
        types/
        constants/
        utils/
      package.json
  scripts/
  docs/
    prd.md
    architecture.md
    architecture/
      source-tree.md
  .env.example
  package.json
  package-lock.json
```

## Story 1.1 placement notes
- Monorepo root uses npm workspaces with `apps/web`, `apps/api`, and `packages/shared`.
- Canary page lives at `apps/web/src/app/(public)/page.tsx` and tests under `apps/web/tests/pages`.
- Health endpoint lives under `apps/api/src/modules/health` with integration tests under `apps/api/tests/integration`.
- CI workflow is `C:\projects\upsail2\.github\workflows\ci.yaml` and should run install/test/build on main.
- Root scripts (`build:web`, `start:web`, `build:api`, `start:api`, `test`) live in `C:\projects\upsail2\package.json`.
- Environment examples are documented in `C:\projects\upsail2\.env.example`.

## Tooling and workflow files
- `C:\projects\upsail2\package.json` defines npm workspaces and root scripts that orchestrate app builds.
- `C:\projects\upsail2\package-lock.json` pins dependency versions for CI consistency.
- `C:\projects\upsail2\apps\web\package.json` and `C:\projects\upsail2\apps\api\package.json` define app-specific scripts used by root scripts and CI.
- `C:\projects\upsail2\.github\workflows\ci.yaml` runs install/test/build on pushes to main.
- `C:\projects\upsail2\.env.example` documents required environment variables for local and CI setup.
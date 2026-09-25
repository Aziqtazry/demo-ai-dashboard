# Dashboard Pemantauan Pintar MBDK

Frontend demonstration mockup for the MBDK smart monitoring platform, built from the supplied User Requirements Specification (URS). All content, telemetry, alerts, video tiles, and identities shown in this demo are synthetic.

## Demo coverage

- Public city portal and staff login/MFA journey
- Role-aware views for management, enforcement, and IT personas
- Main and executive dashboards
- CCTV, drone, traffic, disaster, GIS, parking/ANPR, complaints, AI, Smart City, and administration modules
- Responsive desktop and mobile layouts
- Fixture-backed frontend boundary ready for a future Laravel API

The complete requirement map, implementation notes, deployment choices, data recommendations, and Mermaid system flowcharts are in [`plan.md`](plan.md).

## Frontend development

```bash
cd frontend
npm install
npm run dev
```

The demo login fields and six-digit MFA code are pre-filled. Select a persona, complete both steps, and use the sidebar to move through the modules.

### Verification

```bash
cd frontend
npm run build
npm run test:e2e
npm audit
```

## Intended production topology

The preferred deployment is:

- Vercel: React/TypeScript frontend from `frontend/`
- Railway: Laravel API, queues, scheduler, integration gateway, and audit boundary
- Supabase: managed PostgreSQL with PostGIS, row-level security, backups, and storage where appropriate

Laravel Cloud is retained as the managed Laravel alternative. The frontend reads its API origin from `VITE_API_BASE_URL`, allowing either backend host without rewriting UI components. Copy `frontend/.env.example` for local configuration.

## Important limitation

This repository currently delivers the frontend demonstration layer only. Authentication, persistence, live integrations, messaging, video streaming, AI inference, enforcement actions, and production security controls still require backend implementation before operational use.

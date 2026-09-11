---
paths:
  - 'app/**'
---

# App

## Avoid database-vendor-specific SQL — must run on MySQL, PostgreSQL, and SQLite
Local dev uses MySQL, tests run on SQLite, and production is moving to PostgreSQL — all three must work. Never use `ilike` (Postgres-only; use `whereLike()`/`orWhereLike()`, which Laravel 13 makes case-insensitive and database-agnostic by default). Never use `::type` casts in raw SQL (Postgres-only). Avoid `EXTRACT()`/date-part SQL functions in selectRaw/groupByRaw/orderByRaw — MySQL, Postgres, and SQLite each spell them differently (SQLite has no EXTRACT at all); fetch rows and group/aggregate in PHP instead (see `ReportMetricsService::studentSummary()`). `CASE WHEN`/`SUM`/`COUNT` raw SQL is fine — that's ANSI-standard and works identically everywhere. When in doubt, verify a query against the real MySQL dev DB (bd-coaching-crm.dev) with tinker, not just the SQLite test suite, since some incompatibilities (like `ilike`) only surface on one engine and would otherwise slip through silently.

---
paths:
  - 'app/Http/Controllers/**'
---

# Controllers

## Extract reusable read/query logic into Services, not Actions
When a controller method (e.g. DashboardController) computes multiple related read-only metrics/aggregates across models that a future API endpoint will also need, extract them into a class in `app/Services/` (one cohesive class per feature area, e.g. `DashboardMetricsService`) with typed methods returning plain arrays — not `Inertia`/`Response` aware. Inject it via controller constructor promotion. Reserve `app/Actions/` (if introduced later) for discrete single-purpose *write* operations (create/update/delete one thing), not for grouped read queries — splitting cohesive read logic into one Action per metric is unnecessary ceremony here. See `app/Services/DashboardMetricsService.php` for the pattern to copy.

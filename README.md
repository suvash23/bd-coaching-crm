# BD Coaching CRM

A multi-tenant CRM for individual tutors, private-batch teachers, and small-to-medium coaching centers in Bangladesh. It replaces paper registers and spreadsheets with a single place to manage students, batches, class schedules, attendance, and fee collection — localized for BDT and Bangladeshi SMS gateways.

See [docs/architecture_plan.md](docs/architecture_plan.md) for the full product/architecture plan and [docs/implementation_checklist.md](docs/implementation_checklist.md) for current build progress.

## Tech Stack

- **Backend:** Laravel 13 (PHP ^8.3)
- **Frontend:** Inertia.js + React, Tailwind CSS
- **Auth:** Laravel Breeze + Sanctum
- **Testing:** Pest
- **Database:** MySQL locally; PostgreSQL targeted for production (see architecture plan)

## Multi-Tenancy

Every tenant-owned table carries an `organization_id`, enforced automatically by a global Eloquent scope (`app/Models/Scopes/TenantScope.php`) so a query like `Student::all()` is always scoped to the current user's organization. Never trust a client-supplied `organization_id` — always derive it from `$request->user()->organization_id`.

## Getting Started

### Prerequisites

- PHP ^8.3 and Composer
- Node.js and npm
- MySQL (or adjust `DB_*` in `.env` for your own database)

### Install & Configure

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate
```

Update the `DB_*` values in `.env` for your local database, then create the database and run migrations:

```bash
php artisan migrate
```

### Run It

Quickest path — Laravel's built-in dev script runs the PHP server, queue listener, log viewer, and Vite dev server together:

```bash
composer dev
```

Then visit `http://localhost:8000`.

Alternatively, run Vite and the PHP server separately:

```bash
npm run dev        # Vite dev server (HMR)
php artisan serve  # PHP server
```

### Local HTTPS Domain (this dev machine)

This project is also served locally at `https://bd-coaching-crm.dev` through a hand-rolled Homebrew nginx + dedicated PHP-FPM 8.5 pool (not Laravel Herd/Valet), matching the setup used for other local projects on this machine:

- PHP-FPM pool: `/usr/local/etc/php/8.5/php-fpm.d/bd-coaching-crm.conf`
- nginx vhost: `/usr/local/etc/nginx/servers/bd-coaching-crm-dev.conf`
- TLS cert (mkcert): `/usr/local/etc/nginx/ssl/bd-coaching-crm/`
- `/etc/hosts`: `127.0.0.1  bd-coaching-crm.dev`
- `.env`: `APP_URL=https://bd-coaching-crm.dev`, plus `VITE_DEV_SERVER_KEY`/`VITE_DEV_SERVER_CERT`/`VITE_DEV_SERVER_HOST` pointed at the mkcert files above
- `vite.config.js`: `detectTls: false` on the `laravel()` plugin, so Vite reads those `VITE_DEV_SERVER_*` values instead of auto-detecting a Herd cert

With this running, just use `npm run dev` for asset HMR — nginx/PHP-FPM handle serving PHP, so `php artisan serve` isn't needed.

## Testing

```bash
composer test
# or
php artisan test
```

## Code Style

```bash
./vendor/bin/pint
```

# MVP Implementation Checklist

Use this document to track development progress based on the architecture plan. Mark items as completed (`[x]`) as you finish them.

## Milestone 1: Foundation (Week 1)
- [x] **Project Scaffolding**: Setup Laravel 11, React, Inertia.js, and Tailwind CSS.
- [x] **Database Setup**: Configure PostgreSQL connection in `.env`.
- [x] **Multi-Tenancy Setup**: 
  - [x] Create `Organization` model and migration.
  - [x] Implement `TenantScope` (Global Scope) for data isolation.
  - [x] Add `organization_id` to `users` and implement logic to assign users to an organization.
- [x] **Roles & Permissions**: Minimal RBAC setup (Distinguish between Admin and Teacher).
- [x] **Base UI Layout**: Setup authenticated Sidebar layout with navigation links.

## Milestone 2: Academics & Entities (Week 2)
- [x] **Courses**: 
  - [x] Migration & Model.
  - [x] CRUD operations and UI for managing Courses.
- [x] **Batches**: 
  - [x] Migration & Model (Link to Courses).
  - [x] CRUD operations and UI for managing Batches.
- [x] **Students**: 
  - [x] Migration & Model.
  - [x] CRUD operations and UI.
- [x] **Student-Batch Enrollment**: 
  - [x] `batch_student` pivot table logic.
  - [x] UI for assigning/removing students from batches.

## Milestone 3: Class & Attendance Operations (Week 3)
- [x] **Schedules Engine**: Setup abstract ScheduleRules for batches (e.g., Sunday 5 PM).
- [x] **Class Sessions**: 
  - [x] Migration & Model for discrete `class_sessions`.
  - [x] Cron Job / Action to generate actual upcoming sessions based on Schedules.
- [x] **Calendar UI**: View upcoming classes in a list or calendar.
- [x] **Attendance System**: 
  - [x] `attendances` migration and pivot structure.
  - [x] Quick-mark Attendance UI (Present/Absent/Late).

## Milestone 4: Financials (Week 4)
- [x] **Fees (Invoices)**: 
  - [x] Migration & Model for tracking money owed.
  - [x] Monthly automated fee generator (Cron Job on the 1st of the month).
- [x] **Payments (Ledger)**: 
  - [x] Migration & Model linking to Fees.
  - [x] UI to manually log payments (Cash/bKash).
  - [x] Logic to update Fee status (Unpaid -> Partial -> Paid).
- [x] **Receipts**: Basic generation/printing view for payment confirmation.

## Milestone 5: Communication & Reminders (Week 5)
- [x] **Broadcasts / SMS Interface**: Integrated student communications and messaging hub.
- [ ] **Reminders Engine**: 
  - Setup queued Jobs for sending notifications.
  - Daily Cron Job to run at 10 AM checking for dues spanning exactly 3 days prior/today/after.
- [ ] **Notification Logs**: Migration to store SMS delivery attempt statuses for debugging.

## Milestone 6: Dashboard & Reports (Week 6)
- [x] **Dashboard KPI Cards**: Implement "Total Active Students", "Active Batches", and "Today's Classes".
- [x] **Dashboard Action Center**:
  - Implemented Dashboard Controller and data aggregation mapping.
- [x] **Reports Data**: Comprehensive tabular/chart views (Financials, Attendance, Enrollment).
- [x] **Security & QA Checks**: Confirm Tenant isolation and timezone accuracy (BD time).

## Milestone 7: SaaS & Superadmin (Week 7)
- [ ] **SaaS Packages System**: 
  - [ ] Database Schema: Create `packages` and `subscriptions` tables.
  - [ ] Define Pricing Tiers (limits primarily based on total student count):
    - 1. Free Trial (e.g., 14 days, up to 50 students).
    - 2. Basic Package (e.g., up to 200 students).
    - 3. Standard/Pro Package (e.g., up to 500 students).
    - 4. Premium/Enterprise Package (Unlimited students).
  - [ ] Organization Registration: Auto-assign "Free Trial" upon new coaching center signup.
  - [ ] Plan Limits Enforcement (limit max students, batches, SMS based on current package).
  - [ ] Subscription UI: Add Billing/Subscription page for coaching owners with upgrade prompts and trial expiry warnings.
- [ ] **Superadmin Architecture**:
  - [ ] Superadmin authentication & routing (TenantScope bypass logic).
  - [ ] **Superadmin Dashboard**:
    - [ ] View list of all registered Coaching Centers (Organizations).
    - [ ] Aggregated usage metrics per center (Total revenue, active students, used storage).
  - [ ] **Organization Management**:
    - [ ] Ability to manually override or upgrade a center's subscription package.
    - [ ] Toggle active/inactive status (suspend centers for non-payment or violations).

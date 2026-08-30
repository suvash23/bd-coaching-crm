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
- [ ] **Base UI Layout**: Setup authenticated Sidebar layout with navigation links.

## Milestone 2: Academics & Entities (Week 2)
- [ ] **Courses**: 
  - Migration & Model.
  - CRUD operations and UI for managing Courses.
- [ ] **Batches**: 
  - Migration & Model (Link to Courses).
  - CRUD operations and UI for managing Batches.
- [ ] **Students**: 
  - Migration & Model.
  - CRUD operations and UI.
- [ ] **Student-Batch Enrollment**: 
  - `batch_student` pivot table logic.
  - UI for assigning/removing students from batches.

## Milestone 3: Class & Attendance Operations (Week 3)
- [ ] **Schedules Engine**: Setup abstract ScheduleRules for batches (e.g., Sunday 5 PM).
- [ ] **Class Sessions**: 
  - Migration & Model for discrete `class_sessions`.
  - Cron Job / Action to generate actual upcoming sessions based on Schedules.
- [ ] **Calendar UI**: View upcoming classes in a list or calendar.
- [ ] **Attendance System**: 
  - `attendances` migration and pivot structure.
  - Quick-mark Attendance UI (Present/Absent/Late).

## Milestone 4: Financials (Week 4)
- [ ] **Fees (Invoices)**: 
  - Migration & Model for tracking money owed.
  - Monthly automated fee generator (Cron Job on the 1st of the month).
- [ ] **Payments (Ledger)**: 
  - Migration & Model linking to Fees.
  - UI to manually log payments (Cash/bKash).
  - Logic to update Fee status (Unpaid -> Partial -> Paid).
- [ ] **Receipts**: Basic generation/printing view for payment confirmation.

## Milestone 5: Communication & Reminders (Week 5)
- [ ] **SMS Interface**: Create base `SmsProviderInterface` for Bangladesh providers.
- [ ] **Reminders Engine**: 
  - Setup queued Jobs for sending notifications.
  - Daily Cron Job to run at 10 AM checking for dues spanning exactly 3 days prior/today/after.
- [ ] **Notification Logs**: Migration to store SMS delivery attempt statuses for debugging.

## Milestone 6: Dashboard & Reports (Week 6)
- [ ] **Dashboard KPI Cards**: Implement "Total Active Students", "Monthly Collection", and "Outstanding Dues".
- [ ] **Dashboard Action Center**:
  - Implement list of "Today's Classes".
  - Implement list of "Action Needed" (Past Due fees).
- [ ] **Reports Data**: Basic tabular view of Monthly Collection trends.
- [ ] **Security & QA Checks**: Confirm Tenant isolation and timezone accuracy (BD time).

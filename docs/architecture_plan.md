# BD Coaching & Teacher CRM: Architecture & Implementation Plan

## 1. Product Analysis

### Target Users
*   **Primary:** Individual tutors, independent school teachers running private batches, and small-to-medium coaching centers in Bangladesh.
*   **Secondary:** Their students and guardians (deferred to Phase 2).

### Core Problems Solved
*   **Administrative Chaos:** Tutors currently manage students, batches, and complex schedules using paper registers or messy spreadsheets.
*   **Revenue Leakage:** Tracking who paid and who hasn't is manual and error-prone. Many tutors feel awkward chasing payments or simply forget.
*   **Communication Gaps:** Informing students about canceled classes, holidays, or payment dues is tedious.

### Core Value Proposition
A seamless, localized (BDT, BD SMS) digital register that organizes students into batches, handles day-to-day session attendance, and automates fee tracking and awkward payment follow-ups.

### MVP Scope vs. Deferred
*   **MUST HAVE (MVP):** Org creation, student database, batch/schedule management, attendance tracking, monthly/fixed fee generation, manual payment entry, bulk SMS reminders, simple reporting.
*   **SHOULD HAVE (Phase 2):** Student/Guardian portals, automated payment gateways (bKash/Nagad), accounting (expenses/payroll).
*   **LATER (Phase 3):** Zoom integration, AI insights, exams/question banks, multi-branch management.

---

## 2. User Roles & Permissions

For the MVP, we will keep the RBAC (Role-Based Access Control) strictly organizational. 

1.  **Platform Super Admin:** (Internal) Manages tenant subscriptions, system health, and global settings.
2.  **Organization Admin:** (Tenant Owner) Has global access *within their organization*. Can manage billing, add teachers, view all batches, and edit financial records.
3.  **Teacher:** Can only access their assigned batches, mark attendance for their classes, and view student lists. (Financial access is hidden or restricted based on the org admin's settings).
4.  **Student / Guardian:** (Deferred to Phase 2).

---

## 3. Multi-Tenant Architecture

**Recommendation: Single Database, Shared Tables (Logical Isolation)**

**Reasoning:** 
For a B2B SaaS targeting thousands of individual tutors and small centers, a "database-per-tenant" model introduces massive operational overhead (running migrations on 10,000 databases, connection pooling issues). An individual tutor's data size is exceptionally small.

**Implementation:**
*   **Tenant Isolation:** Every tenant-owned table receives an `organization_id` foreign key.
*   **Data Scoping:** Use Laravel's **Global Scopes** (e.g., `TenantScope`) automatically applied to all Eloquent models to ensure a query like `Student::all()` safely translates to `WHERE organization_id = 5`.
*   **User Relationship:** A user belongs to an organization. In the MVP, a user belongs to exactly *one* organization. (If a teacher works at multiple centers, they use different emails for MVP. Phase 2 can introduce a many-to-many `organization_user` pivot table).

---

## 4. Domain Model (Core Entities)

```text
[Organization] 1 -- * [User (Role: Admin/Teacher)]
[Organization] 1 -- * [Student]
[Organization] 1 -- * [Course]

[Course] 1 -- * [Batch]
[Batch] * -- * [User] (Teacher Assignment)
[Batch] * -- * [Student] (Batch Enrollment)

[Batch] 1 -- * [ScheduleRule] (e.g., Mon, Wed 4 PM)
[Batch] 1 -- * [ClassSession] (Actual instantiated classes on specific dates)
[ClassSession] 1 -- * [Attendance] (Present/Absent records)

[Student] 1 -- * [Fee] (Invoice/Ledger indicating amount due)
[Fee] 1 -- * [Payment] (Transactions fulfilling the fee)
```

---

## 5. Database Design

*Note: All tenant tables include `id`, `organization_id` (Indexed), `created_at`, `updated_at`, `deleted_at`.*

*   **`organizations`**: `name`, `phone`, `email`, `address`, `timezone`
*   **`users`**: `name`, `email`, `password`, `role` (Admin/Teacher)
*   **`students`**: `name`, `phone`, `guardian_name`, `guardian_phone`, `status`
*   **`courses`**: `name`, `fee_type` (monthly, strictly_fixed), `amount`
*   **`batches`**: `name`, `course_id`, `capacity`, `status`
*   **`batch_student`**: `batch_id`, `student_id`, `join_date`
*   **`class_sessions`**: `batch_id`, `teacher_id`, `scheduled_date`, `start_time`, `status` (scheduled, completed, cancelled), `topic`
*   **`attendances`**: `class_session_id`, `student_id`, `status` (present, absent, late, excused)
*   **`fees`**: `student_id`, `batch_id`(nullable), `type` (monthly, admission, etc.), `amount_due`, `due_date`, `billing_month`, `status` (unpaid, partial, paid)
*   **`payments`**: `fee_id`, `amount_paid`, `payment_method` (Cash, bKash, Bank), `payment_date`, `transaction_ref`

---

## 6. Fee & Payment Architecture

**Recommended Approach: Invoice/Ledger Hybrid**

*   **Fees (The Invoice):** Represent explicitly what is owed. A background job runs on the 1st of every month automatically generating `Fee` records for active students in "monthly" batches.
*   **Payments (The Transaction):** A ledger of actual money received.
*   **Partial Payments:** If a 1000 BDT fee receives a 600 BDT payment, the system sums `payments` where `fee_id = X`. Since 600 < 1000, the `Fee` status updates to `partial`. 
*   **Discounts:** A dedicated `discount_amount` column on the `Fee` table. `Total Owed = amount_due - discount_amount`.
*   **Bangladesh Context:** bKash/Nagad transactions often happen offline first (sending money to a personal number). The MVP allows Admins to simply manually log a "bKash" payment and type in the last 4 digits as a reference.

---

## 7. Notification Architecture

We need a provider-independent layer, as local BD SMS gateways (e.g., BulkSMSBD, SSLWireless) change often.

1.  **Abstraction:** A Laravel Interface `SmsProviderInterface`. 
2.  **Queue System:** All notifications are dispatched to a Redis queue. Slow HTTP requests to local SMS gateways will not block the user interface.
3.  **Daily Cron Job:** `php artisan notifications:reminders` runs at 10:00 AM (BST).
    *   Query: Find `Fees` where `status != paid` and `due_date` is in exactly 3 days (Before), today (On), or -3 days (After).
    *   Action: Dispatch `SendPaymentReminderJob` for each student.
4.  **Delivery Logs:** Save records to a `notification_logs` table (status, provider_used, error_message) for debugging.

---

## 8. Class & Attendance Architecture

**Critical Design Choice:** Do NOT attach attendance to an abstract repeating rule (e.g., "Mondays"). Attach it to an actual instantiate session (e.g., "Monday, Oct 12th").

1.  **Schedules:** Tutors define schedules (e.g., Sunday / Tuesday at 5 PM).
2.  **Session Generator:** A scheduled job runs nightly, looking 7 days ahead. It reads the schedules and inserts discrete rows into `class_sessions`.
3.  **Flexibility:** Because sessions are discrete database rows, a tutor can click on the session for "Oct 12th", mark it as "Cancelled due to holiday", or reassign the `teacher_id` to a substitute teacher seamlessly without breaking the recurring pattern. Attendance is logged firmly against that specific `class_session_id`.

---

## 9. API Design

We will use RESTful conventions. (Assuming Laravel Sanctum for API token/cookie auth).

```text
// Organization & Auth
POST /api/v1/auth/login
GET  /api/v1/settings/organization

// Core Domain
GET  /api/v1/students
POST /api/v1/students
GET  /api/v1/batches
GET  /api/v1/batches/{id}/students

// Classes & Attendance
GET  /api/v1/classes?date_start=2024-01-01&date_end=2024-01-31
GET  /api/v1/classes/{id}/attendance
PUT  /api/v1/classes/{id}/attendance    // Bulk update attendance

// Financials
GET  /api/v1/fees?status=unpaid,partial
POST /api/v1/fees/{id}/payments         // Log a payment
GET  /api/v1/reports/monthly-collection
```

---

## 10. Frontend Structure

**Recommendation: Laravel Inertia.js with React/Vue (or Nuxt/Next if strictly decoupled).** Inertia provides the snappy, no-refresh feel of an SPA while keeping routing and controllers safely inside Laravel, massively boosting MVP development speed.

**Navigation Layout (Sidebar):**
1.  **Dashboard** (Home)
2.  **Schedule / Classes** (Calendar & Today's lists)
3.  **Students** (Directory)
4.  **Courses & Batches** (Setup)
5.  **Fees & Collection** (Financials)
6.  **Broadcasts** (Manual SMS to batches)
7.  **Reports** 
8.  **Settings**

---

## 11. Dashboard UX

The dashboard must answer a teacher's morning questions instantly.

*   **Top 3 KPI Cards:** Total Active Students | Monthly Collection (BDT) | Total Dues (BDT).
*   **Main Focus (Center):** **"Today's Classes"** list. Each entry has a big "Take Attendance" button. 
*   **Secondary Focus (Right/Bottom):** **"Action Needed"**. A list of students whose fees are past due, with a one-click "Send Reminder SMS" button.

---

## 12. Security Checklist

*   [ ] **Tenant Isolation:** Enforce `TenantScope` on all Eloquent models. NEVER trust `$request->organization_id`; derive it from `$request->user()->organization_id`.
*   [ ] **IDOR Prevention:** Ensure a teacher cannot view a student `GET /students/99` if student 99 belongs to org B.
*   [ ] **Rate Limiting:** Throttle `/api/v1/notifications/sms` to prevent bill-shock from malicious use.
*   [ ] **Financial Safety:** Soft-delete only on payments. Log all payment deletions in an audit table.

---

## 13. Scalability

*   **Database:** PostgreSQL/MySQL will easily handle 10k orgs on a single instance if indexed correctly (Composite Indexes on `org_id` + `status`). 
*   **Queueing:** Redis must be used for job queues. Generating monthly invoices for 100,000 students across the platform on the 1st of the month will timeout a web request. Batching these into Redis queues allows background workers to process them over a few minutes.
*   **Reporting:** Run a nightly cron job that aggregates daily collections into a `reports_daily_aggregate` table so the dashboard doesn't have to SUM() thousands of rows on every page load.

---

## 14. MVP Development Roadmap

*   **Milestone 1: Foundation (Week 1)** - Laravel setup, Database schemas, authentication, Tenancy scopes, UI Layout/Theme shell.
*   **Milestone 2: Academics (Week 2)** - CRUD for Courses, Batches, Students, and assigning students to batches.
*   **Milestone 3: Operations (Week 3)** - Scheduling engine, generating `class_sessions`, calendar UI, and registering Attendance.
*   **Milestone 4: Financials (Week 4)** - Fee generation engine (monthly logic), Payment logging UI, partial payment logic, receipt generation.
*   **Milestone 5: Comms & Dashboard (Week 5)** - SMS Provider integration, background reminders, Dashboard KPIs, basic reporting.
*   **Milestone 6: QA & Launch (Week 6)** - Testing tenant isolation, timezone configuration for BD, deployment to production.

---

## 15. Testing Strategy

*   **CRITICAL: Multi-tenant tests (Feature Tests):** Create User A (Org 1) and User B (Org 2). Ensure User A gets a 403/404 when attempting to access User B's batches.
*   **Financial Logic (Unit Tests):** Test partial payment math. Test that overpaying throws an error.
*   **Cron/Queue Tests:** Mock time manipulation. Traverse to the 1st of the month, execute the billing job, and verify correct invoices are generated.

---

## 16. Deployment Architecture & 17. Cost-Aware Architecture

Do NOT over-engineer the MVP with load balancers and Kubernetes. For a small team validating the market:

**Initial MVP Stack (Single Server + PAAS approach):**
*   **Hosting:** Laravel Forge managing a single DigitalOcean Droplet ($20-$40/mo, 2VCPU/4GB RAM).
*   **Services running on Droplet:** Nginx, PHP8.x-FPM, Redis, Queue Workers.
*   **Database:** DigitalOcean Managed Database (PostgreSQL) ($15/mo). *Worth paying for managed DB for automatic point-in-time backups.*
*   **Storage:** Amazon S3 or Cloudflare R2 (for user avatars/receipts).

*This scales seamlessly up to the first 500 coaching centers before needing application separation.*

---

## 18. Risks & Edge Cases

*   **Student Batch Transfers:** If a student moves from the 4 PM batch to the 5 PM batch mid-month, do they pay twice? *Solution:* Fees are attached to the Student, not strictly the Batch. Allow admins to prorate or override manually.
*   **Bangladesh SMS filtering:** BD Telcos strictly filter promotional language. Templates must be designed as transactional and pre-approved by the gateway.
*   **Timezones:** If the server is UTC, the automatic class session generator might spawn classes on the wrong day. Force Laravel app timezone to `Asia/Dhaka` or handle conversions rigorously.

---

## 19. Final Recommended MVP Scope Summarized

### MVP Modules
Tenant Management, Student Directory, Batch Management, Class/Attendance Tracking, Billing (Fees & Payments), SMS Engine.

### MVP Technical Stack
*   **Backend:** Laravel 11 (PHP 8.3)
*   **Database:** PostgreSQL 16
*   **Frontend:** Inertia.js with React (Tailwind CSS)
*   **Infrastructure:** Redis (Queues/Cache), Laravel Forge, DigitalOcean.

### Features EXPLICITLY Deferred to Phase 2 (Do Not Build Yet)
1.  **Online Payment Gateways (bKash/Nagad Webhooks):** Too much regulatory and technical overhead for MVP. Teachers can accept bKash manually and log it.
2.  **Student/Guardian App Login:** Reduces security overhead. Tutors send SMS receipts for now.
3.  **Exams & Marks:** Keep the MVP strictly focused on operations and money.
4.  **Payroll & Expenses:** Tracking teacher salaries/rent is a different SaaS category. Focus on revenue first.
5.  **Multi-branch structure:** Assume one organization = one location for MVP.

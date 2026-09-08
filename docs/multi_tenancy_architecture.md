# Multi-Tenancy Architecture

## Overview

The `bd-coaching-crm` application is designed as a SaaS (Software as a Service) platform where multiple coaching centers can utilize the application simultaneously. To achieve this, the application leverages a **single-database, multi-tenant architecture**.

### How Coaching Centers Use the App

Each coaching center that registers on the platform is represented internally as a distinct **Organization**. 
* The system is capable of securely serving multiple organizations from a single instance of the application.
* Users (such as teachers, staff, or admins) are explicitly linked to a specific organization.
* When a user performs actions or views data within the app, their access is scoped entirely to their respective organization. This ensures that users from Coaching Center A can only manage and view their own students, batches, courses, and financial records, and remain completely isolated from Coaching Center B's data.

### Database Design

**Do coaching centers have separate databases?** 

No, they do not. The application uses a single, shared PostgreSQL/MySQL database for all coaching centers. 

Data isolation is managed logically at the application and schema level instead of physically via separate databases. This is achieved using an **`organization_id` foreign key** on almost every core table.

Major entities that are scoped by `organization_id` include:
* `users`
* `students`
* `courses`
* `batches`
* `class_sessions`
* `invoices`
* `payments`
* `broadcasts`
* `student_discounts`

### Query Scoping

By relying on the `organization_id` column, the application's backend automatically applies filters to all database queries based on the currently authenticated user's organization. 

When a user requests a list of students, the system dynamically appends `WHERE organization_id = ?` to the database query underneath the hood. This architecture guarantees strict data compartmentalization and privacy while maintaining the simplicity and cost-efficiency of maintaining a unified database schema.

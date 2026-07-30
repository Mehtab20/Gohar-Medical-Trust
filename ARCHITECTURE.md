# Gohar Medical Trust — Production Architecture

> **Hospital Management System (HMS)**
> Built for **Gohar Hospital & Trust Totalai Buner** (est. 2019, Khyber Pakhtunkhwa, Pakistan)
> Built on Freebuff Cloud · React + Vite + TypeScript · Convex · shadcn/ui · Tailwind CSS · Framer Motion · Bun

---

## Real-World Context

This system is purpose-built for **Gohar Hospital & Trust** — a 24/7 community hospital in Totalai, Tehsil Khudukhel, District Buner, KPK, Pakistan founded by **Dr. Gohar Yousafzai** (General Surgeon).

| Detail | Value |
|--------|-------|
| **Founded** | 2019 |
| **Founder & MD** | Dr. Gohar Yousafzai |
| **Location** | Totalai, Buner, KPK, Pakistan |
| **Doctors** | 8+ expert specialists |
| **Patients Served** | 1,675+ |
| **Feedback** | 90% positive |
| **Operation** | 24/7 Emergency |

**Key Design Implications:**
- Mixed digital literacy among staff → simple, intuitive interfaces
- Pashto/Urdu primary languages → visual-heavy design with minimal text
- Rural connectivity → robust error handling, optimistic updates
- Community hospital scale → designed for 10-50 concurrent users, not thousands

> **Full context:** See [`AI_CONTEXT.md`](./AI_CONTEXT.md) for personas, UX strategy, and product vision.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Folder Structure](#2-folder-structure)
3. [Database Schema Design](#3-database-schema-design)
4. [Backend Architecture (Convex)](#4-backend-architecture-convex)
5. [API Module Planning](#5-api-module-planning)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Authentication & Authorization (RBAC)](#7-authentication--authorization-rbac)
8. [Development Roadmap](#8-development-roadmap)
9. [Environment Variables](#9-environment-variables)

---

## 1. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript 5 | UI framework |
| **Build Tool** | Vite 6 | Dev server & prod bundling |
| **Backend / Database** | Convex | Serverless backend, real-time DB, file storage, scheduled jobs |
| **UI Components** | shadcn/ui (Radix + Tailwind) | Accessible, themed component library |
| **Styling** | Tailwind CSS 4 | Utility-first design system |
| **Animation** | Framer Motion | Page transitions, micro-interactions |
| **Auth** | Convex Auth (built-in) | JWT-based authentication with OAuth providers |
| **Package Manager** | Bun 1.3 | Fast installs and script runner |
| **Hosting** | Freebuff Cloud (static + Convex) | Production deploy |

### Why This Stack

| Concern | How It's Addressed |
|---------|-------------------|
| **Real-time reactivity** | Convex queries are live subscriptions — no polling or WebSocket boilerplate |
| **Data consistency** | Convex mutations are transactional and serialized (no race conditions) |
| **Serverless backend** | No provisioning — Convex auto-scales functions and database |
| **HIPAA-readiness** | Convex encrypts at rest (AES-256) and in transit (TLS 1.3) |
| **Audit trail** | Immutable audit logs via Convex table |
| **File storage** | Convex Storage for medical documents, images, reports |
| **Scheduled tasks** | Convex `scheduler` for reminders, batch jobs, report generation |
| **Role-based access** | Convex Auth with custom JWT claims for RBAC |
| **Rapid UI development** | shadcn/ui + Tailwind = consistent, accessible components |

---

## 2. Folder Structure

```
gohar-medical-trust/
│
├── src/
│   ├── convex/                          # 🟢 Convex backend (serverless)
│   │   ├── schema.ts                    #    Database schema (ALL tables)
│   │   ├── seed.ts                      #    Development seed data
│   │   ├── auth.config.ts              #    Auth provider configuration
│   │   ├── auth.ts                      #    Auth helpers
│   │   ├── constants.ts                 #    Shared constants & enums
│   │   │
│   │   ├── users/                       # 🔐 Users & Staff
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── patients/                    # 🧑‍⚕️ Patient Management
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── appointments/               # 📅 Appointment Scheduling
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── medical-records/            # 📋 EHR / EMR
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── billing/                    # 💳 Billing & Payments
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── pharmacy/                   # 💊 Pharmacy & Prescriptions
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── lab/                        # 🔬 Laboratory
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── radiology/                  # 🩻 Radiology & Imaging
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── inventory/                  # 📦 Inventory & Supplies
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── departments/               # 🏢 Departments & Rooms
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── staff/                      # 👥 Staff Management
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── hr/                         # ⏰ HR & Scheduling
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── insurance/                  # 🛡️ Insurance Claims
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── reports/                    # 📊 Reporting & BI
│   │   │   ├── mutations.ts
│   │   │   ├── queries.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── audit/                      # 📝 Audit Trail
│   │   │   ├── mutations.ts
│   │   │   └── queries.ts
│   │   │
│   │   ├── helpers/                    # 🛠️ Shared helpers
│   │   │   ├── pagination.ts
│   │   │   ├── permissions.ts
│   │   │   └── validation.ts
│   │   │
│   │   └── _generated/                # ⚡ Auto-generated by Convex
│   │
│   ├── components/                     # 🧩 Reusable UI components
│   │   ├── ui/                         #    shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (all shadcn primitives)
│   │   │
│   │   ├── layout/                     #    Layout components
│   │   │   ├── app-shell.tsx           #       Main app layout with sidebar
│   │   │   ├── sidebar.tsx             #       Navigation sidebar
│   │   │   ├── topbar.tsx              #       Top header bar
│   │   │   ├── breadcrumbs.tsx         #       Breadcrumb navigation
│   │   │   └── page-container.tsx      #       Page wrapper
│   │   │
│   │   ├── data/                       #    Data display components
│   │   │   ├── data-table.tsx          #       Sortable, filterable table
│   │   │   ├── pagination.tsx          #       Pagination controls
│   │   │   ├── search-input.tsx        #       Debounced search
│   │   │   ├── filter-bar.tsx          #       Filter controls
│   │   │   ├── status-badge.tsx        #       Status indicator
│   │   │   ├── loading-skeleton.tsx    #       Loading skeleton
│   │   │   └── empty-state.tsx         #       Empty state placeholder
│   │   │
│   │   ├── forms/                      #    Form components
│   │   │   ├── patient-form.tsx
│   │   │   ├── appointment-form.tsx
│   │   │   ├── medical-record-form.tsx
│   │   │   ├── billing-form.tsx
│   │   │   └── ... (module-specific forms)
│   │   │
│   │   └── shared/                     #    Shared app components
│   │       ├── confirm-dialog.tsx
│   │       ├── file-upload.tsx
│   │       ├── date-picker.tsx
│   │       ├── printable-report.tsx
│   │       └── error-boundary.tsx
│   │
│   ├── pages/                          # 📄 Route pages (one per route)
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── index.tsx               #    Main dashboard
│   │   │   ├── widgets/
│   │   │   │   ├── bed-occupancy.tsx
│   │   │   │   ├── today-appointments.tsx
│   │   │   │   ├── revenue-card.tsx
│   │   │   │   ├── pending-lab-results.tsx
│   │   │   │   └── alerts-feed.tsx
│   │   │   └── quick-actions.tsx
│   │   │
│   │   ├── patients/
│   │   │   ├── index.tsx               #    Patient list
│   │   │   ├── new.tsx                 #    Register new patient
│   │   │   ├── [patientId]/
│   │   │   │   ├── index.tsx           #    Patient overview
│   │   │   │   ├── edit.tsx            #    Edit patient details
│   │   │   │   ├── medical-records.tsx #    Medical history
│   │   │   │   ├── billing.tsx         #    Billing history
│   │   │   │   └── appointments.tsx    #    Appointment history
│   │   │   └── admit.tsx               #    Admission form
│   │   │
│   │   ├── appointments/
│   │   │   ├── index.tsx               #    Appointment calendar/list
│   │   │   ├── new.tsx                 #    Book appointment
│   │   │   └── [appointmentId].tsx     #    Appointment detail
│   │   │
│   │   ├── medical-records/
│   │   │   ├── index.tsx               #    Record search/list
│   │   │   └── [recordId].tsx          #    Record detail
│   │   │
│   │   ├── billing/
│   │   │   ├── index.tsx               #    Invoice list
│   │   │   ├── new.tsx                 #    Create invoice
│   │   │   ├── [invoiceId].tsx         #    Invoice detail
│   │   │   └── payments.tsx            #    Payment tracking
│   │   │
│   │   ├── pharmacy/
│   │   │   ├── index.tsx               #    Drug inventory
│   │   │   ├── prescriptions.tsx       #    Prescription list
│   │   │   └── dispensing.tsx          #    Dispense medication
│   │   │
│   │   ├── lab/
│   │   │   ├── index.tsx               #    Test catalog
│   │   │   ├── orders.tsx              #    Lab orders
│   │   │   └── [orderId].tsx           #    Order & results
│   │   │
│   │   ├── radiology/
│   │   │   ├── index.tsx               #    Imaging orders
│   │   │   └── [orderId].tsx           #    Order & report
│   │   │
│   │   ├── inventory/
│   │   │   ├── index.tsx               #    Stock overview
│   │   │   ├── transactions.tsx        #    Stock movements
│   │   │   ├── suppliers.tsx           #    Supplier management
│   │   │   └── alerts.tsx              #    Low stock alerts
│   │   │
│   │   ├── staff/
│   │   │   ├── index.tsx               #    Staff directory
│   │   │   ├── new.tsx                 #    Add staff
│   │   │   └── [staffId].tsx           #    Staff profile
│   │   │
│   │   ├── hr/
│   │   │   ├── schedules.tsx           #    Shift scheduling
│   │   │   ├── attendance.tsx          #    Time & attendance
│   │   │   └── payroll.tsx             #    Payroll management
│   │   │
│   │   ├── insurance/
│   │   │   ├── index.tsx               #    Claim list
│   │   │   ├── new.tsx                 #    Submit claim
│   │   │   └── [claimId].tsx           #    Claim detail
│   │   │
│   │   ├── reports/
│   │   │   ├── index.tsx               #    Report dashboard
│   │   │   ├── financial.tsx           #    Financial reports
│   │   │   ├── clinical.tsx            #    Clinical reports
│   │   │   ├── operational.tsx         #    Operational reports
│   │   │   └── custom.tsx              #    Custom report builder
│   │   │
│   │   ├── admin/
│   │   │   ├── departments.tsx         #    Department management
│   │   │   ├── rooms.tsx               #    Room/bed management
│   │   │   ├── users.tsx               #    User management
│   │   │   ├── roles.tsx               #    Role/permission management
│   │   │   ├── audit-log.tsx           #    Audit trail viewer
│   │   │   └── settings.tsx            #    System settings
│   │   │
│   │   └── not-found.tsx               #    404 page
│   │
│   ├── hooks/                          # 🪝 Custom React hooks
│   │   ├── use-auth.ts                 #    Auth state hook
│   │   ├── use-current-user.ts         #    Current user data
│   │   ├── use-permissions.ts          #    Permission check hook
│   │   ├── use-search.ts              #    Debounced search hook
│   │   ├── use-pagination.ts           #    Pagination hook
│   │   ├── use-media-query.ts          #    Responsive breakpoints
│   │   ├── use-toast.ts               #    Toast notifications
│   │   └── use-confirm.ts             #    Confirmation dialog
│   │
│   ├── lib/                            # 📚 Utility libraries
│   │   ├── utils.ts                    #    cn() and general utilities
│   │   ├── format.ts                   #    Date, currency, phone formatters
│   │   ├── validators.ts              #    Form validation helpers
│   │   ├── permissions.ts             #    Permission definitions
│   │   └── constants.ts               #    App-wide constants
│   │
│   ├── providers/                      # 🎭 React context providers
│   │   ├── auth-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── convex-provider.tsx
│   │
│   ├── types/                          # 📐 TypeScript type definitions
│   │   ├── index.ts                    #    Re-exports
│   │   ├── patients.ts
│   │   ├── appointments.ts
│   │   ├── medical-records.ts
│   │   ├── billing.ts
│   │   ├── pharmacy.ts
│   │   ├── lab.ts
│   │   └── ... (per module)
│   │
│   ├── styles/                         # 🎨 Global styles
│   │   └── theme.ts                    #    Design tokens
│   │
│   ├── App.tsx                         # 🟣 Root app with router
│   ├── main.tsx                        # 🔵 Entry point
│   └── index.css                       #    Tailwind directives & CSS vars
│
├── public/                             # 📁 Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── og-image.png
│
├── .env.local                          # 🔑 Local environment variables
├── convex.json                         # Convex deployment config
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── index.html
├── ARCHITECTURE.md                     # ← You are here
└── README.md
```

---

## 3. Database Schema Design

> **Database:** Convex (serverless document store with ACID transactions and real-time subscriptions)
> **Pattern:** One collection per domain entity, linked by `v.id()` references

### Entity-Relationship Overview

```
Users ──┐
         ├── Staff (1:1)
         ├── AuditLogs (1:N)
         
Patients ──┐
           ├── Appointments (1:N)
           ├── MedicalRecords (1:N)
           ├── Prescriptions (1:N)
           ├── LabOrders (1:N)
           ├── RadiologyOrders (1:N)
           ├── BillingInvoices (1:N)
           ├── InsuranceClaims (1:N)
           └── BedAssignments (1:N)

Departments ──┐
              ├── Staff (1:N)
              ├── Rooms (1:N)
              └── InventoryItems (1:N)
```

### Collections (Tables)

#### 🧑 Users (`users`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"users">` | Auto-generated |
| `_creationTime` | `number` | Auto-generated |
| `email` | `string` | Unique, used for auth |
| `name` | `string` | Full name |
| `role` | `string` | `"super_admin" | "admin" | "doctor" | "nurse" | "receptionist" | "pharmacist" | "lab_technician" | "radiologist" | "billing_staff" | "hr"` |
| `isActive` | `boolean` | Soft-delete flag |
| `lastLoginAt` | `number (optional)` | Timestamp |
| `phone` | `string (optional)` | Contact number |
| `avatarStorageId` | `Id<"_storage"> (optional)` | Profile image |

**Indexes:**
- `by_email`: `["email"]` (unique)
- `by_role`: `["role"]`

---

#### 👤 Patients (`patients`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"patients">` | Auto-generated |
| `_creationTime` | `number` | Auto-generated |
| `medicalRecordNumber` | `string` | Unique MRN (auto-generated) |
| `firstName` | `string` | |
| `lastName` | `string` | |
| `dateOfBirth` | `string` | ISO date |
| `gender` | `string` | `"male" | "female" | "other"` |
| `bloodGroup` | `string (optional)` | `"A+" | "A-" | "B+" | ...` |
| `phone` | `string` | Primary contact |
| `email` | `string (optional)` | |
| `address` | `object` | `{ street, city, state, zipCode, country }` |
| `emergencyContact` | `object` | `{ name, relationship, phone }` |
| `insuranceProvider` | `string (optional)` | |
| `insurancePolicyNumber` | `string (optional)` | |
| `allergies` | `string[]` | Known allergies |
| `chronicConditions` | `string[]` | Pre-existing conditions |
| `registrationDate` | `number` | Timestamp of registration |
| `status` | `string` | `"active" | "inactive" | "deceased"` |
| `profilePhotoStorageId` | `Id<"_storage"> (optional)` | Photo |

**Indexes:**
- `by_mrn`: `["medicalRecordNumber"]` (unique)
- `by_name`: `["lastName", "firstName"]`
- `by_phone`: `["phone"]`
- `by_status`: `["status"]`
- `by_registration_date`: `["registrationDate"]`

---

#### 📅 Appointments (`appointments`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"appointments">` | Auto-generated |
| `_creationTime` | `number` | Auto-generated |
| `patientId` | `Id<"patients">` | FK → patients |
| `doctorId` | `Id<"users">` | FK → users (role=doctor) |
| `departmentId` | `Id<"departments">` | FK → departments |
| `appointmentType` | `string` | `"checkup" | "followup" | "emergency" | "surgery" | "consultation"` |
| `scheduledDate` | `number` | Timestamp |
| `startTime` | `string` | HH:mm format |
| `endTime` | `string` | HH:mm format |
| `duration` | `number` | Minutes |
| `status` | `string` | `"scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show"` |
| `reason` | `string` | Reason for visit |
| `notes` | `string (optional)` | Doctor's notes |
| `priority` | `string` | `"routine" | "urgent" | "emergency"` |
| `roomId` | `Id<"rooms"> (optional)` | Assigned room |

**Indexes:**
- `by_patient`: `["patientId"]`
- `by_doctor`: `["doctorId"]`
- `by_date`: `["scheduledDate"]`
- `by_status`: `["status"]`
- `by_doctor_date`: `["doctorId", "scheduledDate"]`
- `by_department_date`: `["departmentId", "scheduledDate"]`

---

#### 📋 Medical Records (`medicalRecords`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"medicalRecords">` | Auto-generated |
| `_creationTime` | `number` | Auto-generated |
| `patientId` | `Id<"patients">` | FK → patients |
| `doctorId` | `Id<"users">` | Attending doctor |
| `appointmentId` | `Id<"appointments"> (optional)` | Linked appointment |
| `recordType` | `string` | `"consultation" | "admission" | "discharge_summary" | "surgery" | "followup" | "lab_report" | "imaging_report"` |
| `diagnosis` | `string (optional)` | ICD-10 coded diagnosis |
| `symptoms` | `string[]` | Reported symptoms |
| `vitalSigns` | `object (optional)` | `{ bloodPressure, heartRate, temperature, respiratoryRate, oxygenSaturation, weight, height }` |
| `treatmentPlan` | `string (optional)` | Prescribed treatment plan |
| `notes` | `string` | Clinical notes (SOAP format) |
| `attachments` | `Id<"_storage">[]` | File attachments |
| `isConfidential` | `boolean` | Restricted access flag |
| `createdAt` | `number` | Timestamp |

**Indexes:**
- `by_patient`: `["patientId"]`
- `by_doctor`: `["doctorId"]`
- `by_type`: `["recordType"]`
- `by_patient_created`: `["patientId", "_creationTime"]`

---

#### 💳 Billing Invoices (`billingInvoices`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"billingInvoices">` | Auto-generated |
| `_creationTime` | `number` | Auto-generated |
| `invoiceNumber` | `string` | Unique (auto-generated) |
| `patientId` | `Id<"patients">` | FK → patients |
| `appointmentId` | `Id<"appointments"> (optional)` | Linked appointment |
| `items` | `array<object>` | `{ description, quantity, unitPrice, total, category, code (ICD-10/CPT) }` |
| `subtotal` | `number` | Before tax/discount |
| `taxAmount` | `number` | Tax applied |
| `discountAmount` | `number` | Discount applied |
| `totalAmount` | `number` | Final amount |
| `insuranceClaimed` | `boolean` | Sent to insurance? |
| `insuranceApprovedAmount` | `number (optional)` | |
| `patientResponsibility` | `number` | Patient's out-of-pocket |
| `amountPaid` | `number` | Total paid so far |
| `balanceDue` | `number` | Remaining balance |
| `status` | `string` | `"draft" | "issued" | "partial_paid" | "paid" | "overdue" | "cancelled" | "refunded"` |
| `dueDate` | `number` | Payment due date |
| `issuedBy` | `Id<"users">` | Billing staff |

**Indexes:**
- `by_invoice_number`: `["invoiceNumber"]` (unique)
- `by_patient`: `["patientId"]`
- `by_status`: `["status"]`
- `by_due_date`: `["dueDate"]`

---

#### 💰 Payments (`payments`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"payments">` | Auto-generated |
| `invoiceId` | `Id<"billingInvoices">` | FK → billingInvoices |
| `patientId` | `Id<"patients">` | FK → patients |
| `amount` | `number` | Payment amount |
| `paymentMethod` | `string` | `"cash" | "card" | "bank_transfer" | "insurance" | "online"` |
| `transactionReference` | `string (optional)` | Reference/transaction ID |
| `paymentDate` | `number` | Timestamp |
| `receivedBy` | `Id<"users">` | Staff who took payment |
| `notes` | `string (optional)` | |

**Indexes:**
- `by_invoice`: `["invoiceId"]`
- `by_patient`: `["patientId"]`
- `by_date`: `["paymentDate"]`

---

#### 💊 Pharmacy / Prescriptions (`prescriptions`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"prescriptions">` | Auto-generated |
| `_creationTime` | `number` | Auto-generated |
| `patientId` | `Id<"patients">` | FK → patients |
| `doctorId` | `Id<"users">` | Prescribing doctor |
| `medicationName` | `string` | Drug name |
| `dosage` | `string` | e.g. "500mg" |
| `frequency` | `string` | e.g. "3 times daily" |
| `route` | `string` | `"oral" | "IV" | "IM" | "topical" | ...` |
| `duration` | `string` | e.g. "7 days" |
| `quantity` | `number` | Total quantity |
| `refills` | `number` | Number of refills |
| `instructions` | `string` | Special instructions |
| `status` | `string` | `"active" | "dispensed" | "completed" | "cancelled"` |
| `dispensedById` | `Id<"users"> (optional)` | Pharmacist |
| `dispensedAt` | `number (optional)` | When dispensed |
| `notes` | `string (optional)` | |

**Indexes:**
- `by_patient`: `["patientId"]`
- `by_doctor`: `["doctorId"]`
- `by_status`: `["status"]`

---

#### 🔬 Lab Tests / Orders (`labOrders`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"labOrders">` | Auto-generated |
| `_creationTime` | `number` | Auto-generated |
| `patientId` | `Id<"patients">` | FK → patients |
| `doctorId` | `Id<"users">` | Ordering doctor |
| `testType` | `string` | e.g. "CBC", "Blood Sugar", "Lipid Profile" |
| `priority` | `string` | `"routine" | "urgent" | "stat"` |
| `sampleType` | `string (optional)` | `"blood" | "urine" | "stool" | "tissue" | ...` |
| `sampleCollectedAt` | `number (optional)` | Collection time |
| `sampleCollectedById` | `Id<"users"> (optional)` | Collector |
| `resultValue` | `string (optional)` | Result data |
| `referenceRange` | `string (optional)` | Normal range |
| `isAbnormal` | `boolean (optional)` | Flagged abnormal |
| `resultNotes` | `string (optional)` | Lab technician notes |
| `resultFileStorageId` | `Id<"_storage"> (optional)` | Uploaded report |
| `status` | `string` | `"ordered" | "sample_collected" | "in_analysis" | "completed" | "cancelled"` |
| `verifiedById` | `Id<"users"> (optional)` | Verifying pathologist |
| `completedAt` | `number (optional)` | Completion timestamp |

**Indexes:**
- `by_patient`: `["patientId"]`
- `by_doctor`: `["doctorId"]`
- `by_status`: `["status"]`
- `by_type`: `["testType"]`

---

#### 🩻 Radiology Orders (`radiologyOrders`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"radiologyOrders">` | Auto-generated |
| `_creationTime` | `number` | Auto-generated |
| `patientId` | `Id<"patients">` | FK → patients |
| `doctorId` | `Id<"users">` | Ordering doctor |
| `imagingType` | `string` | `"X-Ray" | "MRI" | "CT" | "Ultrasound" | "Mammography" | ...` |
| `bodyPart` | `string` | e.g. "Chest", "Right Knee" |
| `priority` | `string` | `"routine" | "urgent" | "stat"` |
| `clinicalHistory` | `string (optional)` | Clinical indication |
| `technicianId` | `Id<"users"> (optional)` | Performing technician |
| `performedAt` | `number (optional)` | When imaging was done |
| `report` | `string (optional)` | Radiologist report |
| `reportFileStorageId` | `Id<"_storage"> (optional)` | DICOM/image files |
| `radiologistId` | `Id<"users"> (optional)` | Reporting radiologist |
| `status` | `string` | `"ordered" | "scheduled" | "performed" | "report_pending" | "completed" | "cancelled"` |

**Indexes:**
- `by_patient`: `["patientId"]`
- `by_doctor`: `["doctorId"]`
- `by_status`: `["status"]`
- `by_type`: `["imagingType"]`

---

#### 📦 Inventory Items (`inventoryItems`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"inventoryItems">` | Auto-generated |
| `_creationTime` | `number` | Auto-generated |
| `itemCode` | `string` | SKU/ID code |
| `name` | `string` | Item name |
| `category` | `string` | `"medication" | "surgical" | "ppe" | "equipment" | "lab_supply" | "general"` |
| `departmentId` | `Id<"departments"> (optional)` | Assigned department |
| `supplierId` | `Id<"suppliers"> (optional)` | FK → suppliers |
| `unitOfMeasure` | `string` | e.g. "piece", "box", "liter" |
| `unitPrice` | `number` | Purchase price per unit |
| `sellingPrice` | `number` | Selling price per unit |
| `currentStock` | `number` | Available quantity |
| `minimumStock` | `number` | Reorder threshold |
| `maximumStock` | `number` | Max capacity |
| `batchNumber` | `string (optional)` | Lot/batch number |
| `expiryDate` | `number (optional)` | Expiration timestamp |
| `location` | `string (optional)` | Storage location |
| `status` | `string` | `"in_stock" | "low_stock" | "out_of_stock" | "expired"` |

**Indexes:**
- `by_code`: `["itemCode"]` (unique)
- `by_category`: `["category"]`
- `by_status`: `["status"]`
- `by_expiry`: `["expiryDate"]`

---

#### 🔄 Inventory Transactions (`inventoryTransactions`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"inventoryTransactions">` | Auto-generated |
| `itemId` | `Id<"inventoryItems">` | FK → inventoryItems |
| `type` | `string` | `"purchase" | "sale" | "transfer" | "adjustment" | "expiry"` |
| `quantity` | `number` | Positive for in, negative for out |
| `unitPrice` | `number` | Price at transaction time |
| `totalPrice` | `number` | Quantity × unit price |
| `referenceType` | `string (optional)` | e.g. "prescription", "purchase_order" |
| `referenceId` | `string (optional)` | Document ID reference |
| `performedById` | `Id<"users">` | Who performed the transaction |
| `notes` | `string (optional)` | |
| `transactionDate` | `number` | Timestamp |

**Indexes:**
- `by_item`: `["itemId"]`
- `by_type`: `["type"]`
- `by_date`: `["transactionDate"]`

---

#### 🏢 Departments (`departments`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"departments">` | Auto-generated |
| `code` | `string` | Unique dept code |
| `name` | `string` | Department name |
| `description` | `string (optional)` | |
| `headOfDepartment` | `Id<"users"> (optional)` | FK → users |
| `phone` | `string (optional)` | |
| `location` | `string (optional)` | Physical location |
| `isActive` | `boolean` | |

---

#### 🛏️ Rooms (`rooms`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"rooms">` | Auto-generated |
| `roomNumber` | `string` | Room identifier |
| `departmentId` | `Id<"departments">` | FK → departments |
| `roomType` | `string` | `"general_ward" | "private" | "semi_private" | "icu" | "nicu" | "operation_theatre" | "emergency" | "consultation"` |
| `floor` | `number` | Floor number |
| `capacity` | `number` | Total beds |
| `occupiedBeds` | `number` | Current occupancy |
| `ratePerDay` | `number` | Daily charge |
| `amenities` | `string[]` | AC, TV, etc. |
| `status` | `string` | `"available" | "occupied" | "maintenance" | "reserved"` |

**Indexes:**
- `by_department`: `["departmentId"]`
- `by_type`: `["roomType"]`
- `by_status`: `["status"]`

---

#### 🛏️ Bed Assignments (`bedAssignments`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"bedAssignments">` | Auto-generated |
| `patientId` | `Id<"patients">` | FK → patients |
| `roomId` | `Id<"rooms">` | FK → rooms |
| `admissionDate` | `number` | Admission timestamp |
| `expectedDischargeDate` | `number (optional)` | |
| `actualDischargeDate` | `number (optional)` | |
| `admittedById` | `Id<"users">` | Admitting staff |
| `status` | `string` | `"active" | "discharged" | "transferred"` |
| `diagnosis` | `string (optional)` | Reason for admission |

---

#### 👥 Staff Profiles (`staff`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"staff">` | Auto-generated |
| `userId` | `Id<"users">` | FK → users (1:1) |
| `departmentId` | `Id<"departments">` | FK → departments |
| `employeeId` | `string` | Unique employee code |
| `specialization` | `string (optional)` | Medical specialty |
| `qualification` | `string[]` | Degrees/certifications |
| `licenseNumber` | `string (optional)` | Medical license |
| `licenseExpiryDate` | `number (optional)` | License renewal date |
| `dateOfJoining` | `number` | Employment start date |
| `employmentType` | `string` | `"full_time" | "part_time" | "contract" | "visiting"` |
| `shiftPreference` | `string` | `"morning" | "evening" | "night" | "rotating"` |
| `consultationFee` | `number (optional)` | For doctors |

---

#### ⏰ Staff Schedules (`staffSchedules`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"staffSchedules">` | Auto-generated |
| `staffId` | `Id<"staff">` | FK → staff |
| `date` | `string` | ISO date |
| `shiftStart` | `string` | HH:mm |
| `shiftEnd` | `string` | HH:mm |
| `departmentId` | `Id<"departments">` | |
| `status` | `string` | `"scheduled" | "checked_in" | "checked_out" | "absent" | "on_leave"` |
| `notes` | `string (optional)` | |

**Indexes:**
- `by_staff_date`: `["staffId", "date"]`
- `by_date`: `["date"]`

---

#### 🛡️ Insurance Claims (`insuranceClaims`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"insuranceClaims">` | Auto-generated |
| `patientId` | `Id<"patients">` | FK → patients |
| `invoiceId` | `Id<"billingInvoices">` | FK → billingInvoices |
| `claimNumber` | `string` | Unique claim identifier |
| `insuranceProvider` | `string` | Provider name |
| `policyNumber` | `string` | |
| `claimAmount` | `number` | Amount claimed |
| `approvedAmount` | `number (optional)` | Approved amount |
| `status` | `string` | `"draft" | "submitted" | "under_review" | "approved" | "denied" | "partially_approved"` |
| `submittedDate` | `number` | |
| `responseDate` | `number (optional)` | |
| `documents` | `Id<"_storage">[]` | Supporting documents |
| `notes` | `string (optional)` | |

---

#### 📝 Audit Logs (`auditLogs`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"auditLogs">` | Auto-generated |
| `action` | `string` | `"create" | "read" | "update" | "delete"` |
| `entityType` | `string` | e.g. "patient", "appointment" |
| `entityId` | `string` | ID of affected entity |
| `userId` | `Id<"users">` | Who performed the action |
| `changes` | `object (optional)` | Before/after diff |
| `ipAddress` | `string (optional)` | |
| `timestamp` | `number` | Auto-generated |

**Indexes:**
- `by_user`: `["userId"]`
- `by_entity`: `["entityType", "entityId"]`
- `by_timestamp`: `["timestamp"]`

---

#### 📊 Reports (`reports`)

| Field | Type | Notes |
|-------|------|-------|
| `_id` | `Id<"reports">` | Auto-generated |
| `name` | `string` | Report name |
| `type` | `string` | `"financial" | "clinical" | "operational" | "custom"` |
| `parameters` | `object` | Filter criteria |
| `generatedById` | `Id<"users">` | Who requested it |
| `generatedAt` | `number` | |
| `fileStorageId` | `Id<"_storage"> (optional)` | Generated file |
| `status` | `string` | `"pending" | "generating" | "completed" | "failed"` |

---

## 4. Backend Architecture (Convex)

### Architecture Pattern: Feature Modules

Each domain is a **self-contained module** inside `src/convex/` with:

```
module/
├── mutations.ts    # Write operations (create, update, delete)
├── queries.ts      # Read operations (list, get, search)
└── validators.ts   # Zod-like input validation schemas
```

### Shared Infrastructure

| File | Purpose |
|------|---------|
| `schema.ts` | Single source of truth for ALL tables |
| `auth.config.ts` | Auth provider config (Convex Auth) |
| `auth.ts` | Auth helper functions |
| `constants.ts` | Enums, role definitions, status lists |
| `helpers/permissions.ts` | Role-based authorization middleware |
| `helpers/pagination.ts` | Cursor-based pagination utilities |
| `helpers/validation.ts` | Common validation helpers |

### Authorization Middleware Pattern

Every mutation/query checks permissions:

```typescript
// Pattern for all Convex functions
export const listPatients = query({
  args: { ... },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    const user = await getCurrentUser(ctx);
    requireRole(user, ["admin", "doctor", "nurse", "receptionist"]);
    
    // ... business logic
  },
});
```

### File Storage Strategy

| Use Case | Storage Location | Access Pattern |
|----------|-----------------|----------------|
| Patient photos | Convex Storage | `generateUploadUrl()` then store ID in patient record |
| Lab reports (PDF) | Convex Storage | Upload → store ID in labOrder → accessible via signed URL |
| Radiology images (DICOM) | Convex Storage | Upload → store ID in radiologyOrder |
| Insurance documents | Convex Storage | Upload → store IDs in insuranceClaim |
| Generated reports | Convex Storage | Generated by scheduled report job |

### Scheduled Jobs (Cron)

| Job | Schedule | Description |
|-----|----------|-------------|
| Appointment reminders | Daily at 8 AM | Send SMS/email reminders for next-day appointments |
| Overdue invoice alerts | Daily at 9 AM | Flag invoices past due date |
| Low stock alerts | Every 6 hours | Check inventory levels and create alerts |
| Expiry date checks | Daily at midnight | Flag nearing-expiry inventory items |
| Report generation | Weekly/Nightly | Generate scheduled reports |
| Audit log archival | Monthly | Archive logs older than retention period |

---

## 5. API Module Planning

Each module exposes a set of **Convex functions** (queries for reads, mutations for writes, actions for external integrations).

### 🧑‍⚕️ Patients Module

| Function | Type | Description |
|----------|------|-------------|
| `createPatient` | Mutation | Register a new patient |
| `updatePatient` | Mutation | Update patient demographics |
| `getPatient` | Query | Get patient by ID |
| `getPatientByMRN` | Query | Lookup by medical record number |
| `listPatients` | Query | Search/filter patient list |
| `searchPatients` | Query | Full-text search across name, MRN, phone |
| `deletePatient` | Mutation | Soft-delete a patient |

### 📅 Appointments Module

| Function | Type | Description |
|----------|------|-------------|
| `createAppointment` | Mutation | Book new appointment |
| `updateAppointment` | Mutation | Reschedule or modify |
| `cancelAppointment` | Mutation | Cancel with reason |
| `completeAppointment` | Mutation | Mark as completed |
| `getAppointment` | Query | Get by ID |
| `listAppointments` | Query | Daily/weekly calendar view |
| `listMyAppointments` | Query | Patient's own appointments |
| `getAvailableSlots` | Query | Open time slots for a doctor/date |

### 📋 Medical Records Module

| Function | Type | Description |
|----------|------|-------------|
| `createMedicalRecord` | Mutation | Add clinical note |
| `updateMedicalRecord` | Mutation | Update record |
| `getMedicalRecord` | Query | Get record by ID |
| `listPatientRecords` | Query | Patient's medical history |
| `uploadAttachment` | Mutation | Upload file to record |

### 💳 Billing Module

| Function | Type | Description |
|----------|------|-------------|
| `createInvoice` | Mutation | Generate invoice |
| `updateInvoice` | Mutation | Modify line items |
| `finalizeInvoice` | Mutation | Issue to patient |
| `recordPayment` | Mutation | Log payment received |
| `processRefund` | Mutation | Process a refund |
| `getInvoice` | Query | Get invoice by ID |
| `listInvoices` | Query | Filtered invoice list |
| `getPatientBalance` | Query | Patient's outstanding balance |
| `getRevenueReport` | Query | Revenue data for dashboard |

### 💊 Pharmacy Module

| Function | Type | Description |
|----------|------|-------------|
| `createPrescription` | Mutation | Write new prescription |
| `dispensePrescription` | Mutation | Pharmacist dispenses medication |
| `getPrescription` | Query | Get by ID |
| `listPatientPrescriptions` | Query | Patient's medication history |
| `listDrugInventory` | Query | Available drugs |
| `addDrugStock` | Mutation | Restock medication |
| `getLowStockAlerts` | Query | Inventory below threshold |

### 🔬 Lab Module

| Function | Type | Description |
|----------|------|-------------|
| `createLabOrder` | Mutation | Order lab tests |
| `collectSample` | Mutation | Mark sample as collected |
| `recordLabResult` | Mutation | Enter test results |
| `verifyLabResult` | Mutation | Pathologist verification |
| `getLabOrder` | Query | Get by ID |
| `listLabOrders` | Query | Filtered lab order list |
| `getPendingResults` | Query | Awaiting results/completion |

### 🩻 Radiology Module

| Function | Type | Description |
|----------|------|-------------|
| `createRadiologyOrder` | Mutation | Order imaging |
| `performImaging` | Mutation | Mark as performed |
| `submitRadiologyReport` | Mutation | Radiologist report |
| `getRadiologyOrder` | Query | Get by ID |
| `listRadiologyOrders` | Query | Filtered list |

### 📦 Inventory Module

| Function | Type | Description |
|----------|------|-------------|
| `createInventoryItem` | Mutation | Add new item |
| `updateStock` | Mutation | Adjust stock levels |
| `recordTransaction` | Mutation | Log inventory movement |
| `listInventory` | Query | Search/filter items |
| `getLowStockItems` | Query | Reorder alerts |
| `getExpiringItems` | Query | Near-expiration items |
| `getInventoryReport` | Query | Stock summary report |

### 👥 Staff / HR Module

| Function | Type | Description |
|----------|------|-------------|
| `createStaffProfile` | Mutation | Add staff member |
| `updateStaffProfile` | Mutation | Update staff details |
| `assignShift` | Mutation | Schedule a shift |
| `recordAttendance` | Mutation | Check-in/check-out |
| `listStaff` | Query | Staff directory |
| `getStaffSchedules` | Query | Roster for a date/week |
| `getAttendanceReport` | Query | Attendance summary |
| `processPayroll` | Action | Generate payroll data |

### 📊 Reports Module

| Function | Type | Description |
|----------|------|-------------|
| `generateReport` | Action | Generate and save report |
| `listReports` | Query | Past reports |
| `getDashboardStats` | Query | Dashboard aggregations |
| `getFinancialSummary` | Query | Revenue, expenses, profit |
| `getClinicalStats` | Query | Patient stats, admission rates |

### 🏢 Admin Module

| Function | Type | Description |
|----------|------|-------------|
| `createDepartment` | Mutation | Add department |
| `updateRoom` | Mutation | Room management |
| `assignBed` | Mutation | Admit patient to bed |
| `dischargePatient` | Mutation | Discharge and free bed |
| `listAuditLogs` | Query | Audit trail with filters |
| `getSystemStats` | Query | System health/usage stats |

---

## 6. Frontend Architecture

### Routing Structure

```
/                             → Landing page / redirect to dashboard
/auth                         → Login / Register
/dashboard                    → Main dashboard with analytics widgets
/patients                     → Patient list (search, filter, paginate)
/patients/new                 → Register new patient
/patients/:id                 → Patient detail view (tabs: overview, records, billing, appointments)
/patients/:id/edit            → Edit patient info
/appointments                 → Appointment calendar / list view
/appointments/new             → Book appointment
/appointments/:id             → Appointment detail
/medical-records              → Medical records search
/medical-records/:id          → Record detail
/billing                      → Invoice list
/billing/new                  → Create invoice
/billing/:id                  → Invoice detail (with payment tracking)
/pharmacy                     → Drug inventory
/pharmacy/prescriptions       → Prescription management
/pharmacy/dispensing          → Dispensing workstation
/lab                          → Lab orders
/lab/orders/:id               → Lab order & results entry
/radiology                    → Radiology orders
/radiology/orders/:id         → Imaging order & report
/inventory                    → Stock management
/inventory/suppliers          → Supplier directory
/inventory/transactions       → Stock movement log
/staff                        → Staff directory
/staff/new                    → Add staff member
/staff/:id                    → Staff profile
/hr/schedules                 → Shift scheduling calendar
/hr/attendance                → Attendance tracking
/hr/payroll                   → Payroll management
/insurance                    → Insurance claims
/insurance/new                → Submit claim
/insurance/:id                → Claim detail
/reports                      → Report center
/reports/financial            → Financial reports
/reports/clinical             → Clinical reports
/reports/operational          → Operational reports
/admin/departments            → Department management
/admin/rooms                  → Room & bed management
/admin/users                  → User account management
/admin/roles                  → Role & permission management
/admin/audit-log              → Audit trail viewer
/admin/settings               → System settings
```

### State Management

- **Server state:** Convex queries (reactive subscriptions) — no Redux/Zustand needed
- **URL state:** React Router v6 (search params, route params)
- **Form state:** React controlled components or lightweight form library
- **UI state:** React `useState` / `useReducer` locally
- **Auth state:** Convex Auth + custom `useAuth()` hook

### Component Hierarchy

```
<App>
  <ThemeProvider>
    <ConvexProvider>
      <AuthProvider>
        <Router>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients/*" element={<PatientModule />} />
              <Route path="/appointments/*" element={<AppointmentModule />} />
              <!-- ... all other authenticated routes -->
              <Route path="/admin/*" element={<AdminModule />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Router>
      </AuthProvider>
    </ConvexProvider>
  </ThemeProvider>
</App>
```

### UI Design System

| Token | Value |
|-------|-------|
| **Primary** | `#0A5C36` (deep medical green — trust, health) |
| **Secondary** | `#1A6B9A` (medical blue — calm, professional) |
| **Accent** | `#E8A838` (warm amber — urgency, highlights) |
| **Danger** | `#C53030` (critical alerts) |
| **Success** | `#2F855A` (positive outcomes) |
| **Background** | `#F8FAFC` (light, clean) |
| **Surface** | `#FFFFFF` |
| **Text** | `#1A202C` |
| **Muted** | `#718096` |

### Key UI Patterns

1. **Dashboard** — Summary cards (KPI metrics), interactive charts (admissions, revenue, occupancy), real-time alerts feed, quick-action toolbar
2. **Data Tables** — Sortable, filterable, paginated tables with search and row actions
3. **Detail Views** — Tabbed interfaces for patient/invoice/record drill-downs
4. **Forms** — Multi-step forms (admission), smart defaults, inline validation
5. **Calendar** — Appointment scheduling with drag-to-reschedule, color-coded by status
6. **Kanban / Workflow** — Lab/pharmacy order status boards
7. **Responsive** — Full desktop experience with mobile breakpoints for on-the-go access

---

## 7. Authentication & Authorization (RBAC)

### Auth Provider: Convex Auth

Leverage **Convex Auth** with built-in JWT authentication and OAuth providers.

### Supported Auth Methods

| Method | Implementation |
|--------|----------------|
| **Email + Password** | Convex Auth with password hashing |
| **Google OAuth** | OAuth 2.0 via Convex Auth |
| **Magic Link** | Convex Auth email-based |

### Role Hierarchy

```
super_admin  →  Full system access, all modules, all settings
       │
       ├── admin  →  All operational modules, user management, reporting
       │
       ├── doctor  →  Patients, medical records, prescriptions, lab/radiology orders, appointments
       │
       ├── nurse  →  Patients (view), medical records (write), vitals, bed assignments
       │
       ├── receptionist  →  Patient registration, appointments, billing (view)
       │
       ├── pharmacist  →  Pharmacy module, inventory (medications), dispensing
       │
       ├── lab_technician  →  Lab orders, sample management, results entry
       │
       ├── radiologist  →  Radiology orders, imaging reports
       │
       ├── billing_staff  →  Invoices, payments, insurance claims
       │
       └── hr  →  Staff profiles, schedules, attendance, payroll
```

### Permission Matrix (Module × Role)

| Module | super_admin | admin | doctor | nurse | receptionist | pharmacist | lab_tech | radiologist | billing | hr |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Dashboard | R | R | R | R | R | R | R | R | R | R |
| Patients | CRUD | CRUD | CRUD | CRU | CRU | R | R | R | R | — |
| Appointments | CRUD | CRUD | CRUD | CRU | CRUD | — | — | — | R | — |
| Medical Records | CRUD | CRUD | CRUD | CRUD | R | R | R | R | — | — |
| Billing | CRUD | CRUD | — | — | R | — | — | — | CRUD | — |
| Pharmacy | CRUD | CRUD | CRU | — | — | CRUD | — | — | — | — |
| Lab | CRUD | CRUD | CRU | — | — | — | CRUD | — | — | — |
| Radiology | CRUD | CRUD | CRU | — | — | — | — | CRUD | — | — |
| Inventory | CRUD | CRUD | — | R | — | CRU | CRU | — | — | — |
| Staff/HR | CRUD | CRU | R | R | — | R | R | R | R | CRUD |
| Reports | CRUD | CRUD | R | R | R | R | R | R | R | R |
| Admin Settings | CRUD | CRU | — | — | — | — | — | — | — | — |
| Audit Logs | CRUD | R | — | — | — | — | — | — | — | — |

*(R = Read, C = Create, U = Update, D = Delete)*

### RBAC Implementation

```typescript
// Permission check utility (Convex helper)
const PERMISSIONS = {
  patients: { admin: "crud", doctor: "crud", nurse: "cru", receptionist: "cru" },
  appointments: { admin: "crud", doctor: "crud", receptionist: "crud", nurse: "cru" },
  billing: { admin: "crud", billing_staff: "crud", doctor: null },
  // ...
} as const;

function requireRole(user: User, allowedRoles: string[]) {
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: insufficient permissions");
  }
}

function requirePermission(user: User, module: string, action: "c" | "r" | "u" | "d") {
  const perms = PERMISSIONS[module]?.[user.role];
  if (!perms || !perms.includes(action)) {
    throw new Error("Forbidden: insufficient permissions");
  }
}
```

---

## 8. Development Roadmap

### Phase 1: Foundation (Week 1–2)

| Step | Tasks |
|------|-------|
| **1.1** | Scaffold project with Vite + React + TypeScript + Convex |
| **1.2** | Configure Tailwind, shadcn/ui, Framer Motion |
| **1.3** | Set up Convex schema (`schema.ts`) with all tables |
| **1.4** | Implement Convex Auth (email/password + OAuth) |
| **1.5** | Build RBAC middleware (permissions helper) |
| **1.6** | Create auth pages (login, register) |
| **1.7** | Build app shell layout (sidebar, topbar, breadcrumbs) |
| **1.8** | Implement routing with auth guard (`RequireAuth`) |
| **1.9** | Build landing page |
| **1.10** | Configure preview commands & deploy |

### Phase 2: Core Clinical Modules (Week 3–4)

| Step | Tasks |
|------|-------|
| **2.1** | Patient management (CRUD, search, MRN generation) |
| **2.2** | Department & room/bed management |
| **2.3** | Appointment scheduling (calendar view, slot management) |
| **2.4** | Patient admission / discharge / transfer workflow |
| **2.5** | Medical records (SOAP notes, vitals, attachments) |
| **2.6** | Dashboard — clinical KPIs, occupancy, alerts |

### Phase 3: Ancillary Services (Week 5–6)

| Step | Tasks |
|------|-------|
| **3.1** | Lab information system (order, collect, result, verify) |
| **3.2** | Radiology / imaging orders & reporting |
| **3.3** | Pharmacy / prescription management & dispensing |
| **3.4** | Inventory management (stock, transactions, suppliers) |
| **3.5** | Low stock / expiry alerts system |

### Phase 4: Financial & Admin (Week 7–8)

| Step | Tasks |
|------|-------|
| **4.1** | Billing & invoicing (itemized, insurance split) |
| **4.2** | Payment tracking (partial payments, refunds) |
| **4.3** | Insurance claims management |
| **4.4** | Financial reports & revenue analytics |
| **4.5** | Admin panel (users, roles, departments, rooms) |
| **4.6** | Audit log viewer |

### Phase 5: HR & Operations (Week 9)

| Step | Tasks |
|------|-------|
| **5.1** | Staff directory & profiles |
| **5.2** | Shift scheduling & roster management |
| **5.3** | Attendance tracking (check-in/out) |
| **5.4** | Payroll processing & reports |

### Phase 6: Reporting & Polish (Week 10–11)

| Step | Tasks |
|------|-------|
| **6.1** | Custom report builder |
| **6.2** | Operational dashboards (wait times, theatre usage) |
| **6.3** | Export to PDF / Excel |
| **6.4** | Notification system (in-app + email reminders) |
| **6.5** | Performance optimization & caching |
| **6.6** | Comprehensive error handling & edge cases |

### Phase 7: Production Readiness (Week 12)

| Step | Tasks |
|------|-------|
| **7.1** | Security audit (input validation, rate limiting) |
| **7.2** | Role-based UI hiding (menus, buttons per role) |
| **7.3** | Load testing & query optimization |
| **7.4** | Documentation (user manual, admin guide) |
| **7.5** | Data backup & disaster recovery procedures |
| **7.6** | Deploy to Freebuff production |

---

## 9. Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `CONVEX_DEPLOYMENT` | Convex deployment URL | ✅ |
| `AUTH_SECRET` | JWT signing secret (auto-generated by Convex Auth) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (if using Google login) | ⬜ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ⬜ |
| `EMAIL_FROM` | Sender email for notifications | ⬜ |
| `SMTP_HOST` | SMTP server for email | ⬜ |
| `SMTP_PORT` | SMTP port | ⬜ |
| `SMTP_USER` | SMTP username | ⬜ |
| `SMTP_PASS` | SMTP password | ⬜ |
| `PUBLIC_URL` | Public-facing URL (for CORS) | ⬜ |

> **Note:** Convex manages most secrets automatically through its dashboard. Keys marked as ⬜ are optional and can be added later when those features are implemented.

---

## Design Principles

1. **Security-first:** Every Convex function validates authentication and authorization. Patient data is never exposed to unauthorized roles.
2. **Domain-driven:** Each module is self-contained with its own queries, mutations, and validators.
3. **Real-time by default:** Dashboard KPIs, appointment status, lab results — all update reactively via Convex subscriptions.
4. **Audit everything:** Every data mutation is logged in `auditLogs` with user ID, timestamp, and before/after diff.
5. **Progressive disclosure:** UI complexity scales with role — simple views for nurses/receptionists, full tools for doctors/admins.
6. **Offline-resilient semantics:** Convex handles optimistic updates on mutations, providing instant UI feedback while data is persisted server-side.

---

> **Next step:** Ready to start coding? Let's begin with **Phase 1.1 — Project Scaffolding**.

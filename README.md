# 🏥 Gohar Medical Trust — Hospital Management System

> A modern, AI-powered Hospital Management System for **Gohar Hospital & Trust Totalai Buner** — transforming a community hospital in Khyber Pakhtunkhwa into a digitally-empowered healthcare facility.

## About the Hospital

Gohar Hospital & Trust is a 24/7 community hospital in **Totalai, Tehsil Khudukhel, District Buner, Khyber Pakhtunkhwa, Pakistan**. Founded in **2019** by **Dr. Gohar Yousafzai** (General Surgeon), it serves the Buner and surrounding districts with:

- **8+** expert doctors across multiple specialties
- **1,675+** happy patients served
- **90%** positive feedback rate
- **24/7** emergency services
- **Free consultation** offered to all patients

### Departments
General Surgery | OPD | Emergency (24/7) | Gynecology/Obstetrics | Laboratory/Pathology | Cardiology | General Medicine | Pharmacy | Radiology/Imaging

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Backend/Database** | Convex (serverless, real-time) |
| **UI Components** | shadcn/ui + Tailwind CSS |
| **Animation** | Framer Motion |
| **Auth** | Convex Auth (JWT, RBAC) |
| **Package Manager** | Bun |

## Project Status

### ✅ Phase 1 Complete — Foundation
- [x] Vite + React + TypeScript scaffolded
- [x] Tailwind CSS with medical theme
- [x] shadcn/ui primitives
- [x] Convex backend with 18 tables (full schema, indexes, validation)
- [x] RBAC permission system (9 roles × 13 modules)
- [x] User management module
- [x] App shell layout (responsive sidebar + topbar)
- [x] Dashboard with KPI cards and activity feed
- [x] Auth page with hospital branding
- [x] Route guards and module routing

### 🚧 Next — Phase 2: Core Clinical Modules
- [ ] Patient Registration CRUD & MRN generation
- [ ] Patient search (name, MRN, phone)
- [ ] Patient detail view with tabs
- [ ] Department & room/bed management
- [ ] Appointment scheduling with calendar
- [ ] Admission / Discharge / Transfer workflow
- [ ] Medical Records (EHR) with SOAP notes

## Documentation

| Document | Description |
|----------|-------------|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Technical architecture, schema, API planning |
| [`AI_CONTEXT.md`](./AI_CONTEXT.md) | Product vision, user personas, UX decisions, roadmap |

## Getting Started

```bash
bun install
bun run dev
```

The app connects to Convex on `http://127.0.0.1:3210` (local dev) — no account needed.

---

*Built on Freebuff Cloud · React + Convex + shadcn/ui · Gohar Medical Trust*

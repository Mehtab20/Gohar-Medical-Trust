# AI_CONTEXT.md — Gohar Medical Trust HMS

> **Last Updated:** July 30, 2026
> **Phase:** Phase 1 Complete — Foundation Scaffolded
> **Status:** Ready for Phase 2 — Core Clinical Modules

---

## 1. Product Vision

### Elevator Pitch
*"A modern, AI-powered Hospital Management System for Gohar Hospital & Trust, Buner — transforming a 2019-founded community hospital into a digitally-empowered healthcare facility serving the Khyber Pakhtunkhwa region."*

### Vision Statement
To become the benchmark for hospital management technology in Pakistan's district-level healthcare facilities — combining enterprise-grade clinical workflows with AI-powered decision support, designed specifically for the unique needs of Pakistani healthcare.

### Core Values
1. **Community-First:** Built for the patients and doctors of Buner, Swabi, and surrounding districts
2. **Clinical Excellence:** Every feature serves the ultimate goal of better patient outcomes
3. **Operational Efficiency:** Reduce administrative burden so healthcare workers can focus on care
4. **Privacy & Trust:** Handle patient data with the highest security standards
5. **Accessibility:** Design for users with varying digital literacy levels
6. **Scale:** From a single hospital to a multi-facility healthcare network

---

## 2. Real Hospital Context

### About Gohar Hospital & Trust

| Detail | Information |
|--------|-------------|
| **Full Name** | Gohar Hospital & Trust Totalai Buner |
| **Location** | Totalai, Tehsil Khudukhel, District Buner, Khyber Pakhtunkhwa, Pakistan |
| **Founded** | 2019 |
| **Founder & MD** | Dr. Gohar Yousafzai (General Surgeon) |
| **Type** | Private Trust / Community Hospital |
| **Operating Hours** | 24/7 — Emergency services round the clock |
| **Patient Reach** | 1,675+ happy patients served |
| **Doctor Count** | 8+ expert doctors across specialties |
| **Online Appointments** | 50+ booked online |
| **Patient Feedback** | 90% positive feedback rate |
| **Consultation** | Free consultation offered |

### Departments & Services

| Department | Service Details |
|-----------|----------------|
| **General Surgery** | Core service led by Dr. Gohar Yousafzai — advanced surgical care |
| **OPD (Outpatient)** | Routine checkups, consultations, expert medical advice |
| **Emergency** | 24/7 round-the-clock emergency medical services |
| **Gynecology / Obstetrics** | Women's health, maternal care (LHVs & WMO staffed) |
| **Laboratory / Pathology** | Diagnostic lab services, sample testing |
| **Cardiology** | Heart health consultations and diagnostics |
| **General Medicine** | Internal medicine, primary care |
| **Pharmacy** | In-house pharmacy services |
| **Radiology / Imaging** | Diagnostic imaging services |

### Regional Context

- **Primary Language:** Pashto (majority), Urdu (official), English (medical/technical)
- **Region:** Buner District borders Swat, Swabi, and Malakand — a primarily rural/pashtun region
- **Digital Literacy:** Mixed — doctors/nurses may have moderate digital skills; administrative staff may need simpler interfaces
- **Infrastructure:** Power fluctuations, variable internet connectivity — system must work with intermittent connectivity
- **Healthcare Challenges:** Limited specialist availability, patient influx from surrounding rural areas, need for efficient referral management

---

## 3. User Personas

### Persona 1: Dr. Ahmad Khan (Doctor / Surgeon)
| Attribute | Detail |
|-----------|--------|
| **Age** | 45 |
| **Role** | Senior Surgeon, HOD General Surgery |
| **Digital Literacy** | Moderate — comfortable with computers, uses WhatsApp daily |
| **Needs** | Quick patient record access, easy prescription writing, lab result review, surgery scheduling |
| **Pain Points** | Paper records are slow, handwriting illegible, can't access patient history remotely |
| **Goals** | Spend less time on paperwork, more time with patients, make data-driven clinical decisions |
| **UX Priority** | Speed, clarity, minimal clicks to critical information |

### Persona 2: Sister Fatima (Nurse / Ward In-Charge)
| Attribute | Detail |
|-----------|--------|
| **Age** | 32 |
| **Role** | Senior Nurse, Ward In-Charge |
| **Digital Literacy** | Basic — uses smartphone, limited typing skills |
| **Needs** | Quick vitals entry, bed assignment view, medication administration record, shift handover notes |
| **Pain Points** | Paper charts get lost, can't quickly see which beds are free, handover takes too long |
| **Goals** | Complete bedside documentation in under 2 minutes, seamless shift transitions |
| **UX Priority** | Large touch targets, simple forms, clear status indicators, minimal text input |

### Persona 3: Mariam Ali (Receptionist)
| Attribute | Detail |
|-----------|--------|
| **Age** | 26 |
| **Role** | Front Desk Receptionist |
| **Digital Literacy** | Moderate — uses booking systems, Urdu typing ability |
| **Needs** | Fast patient registration, appointment booking, queue management, phone lookup |
| **Pain Points** | Long registration forms, duplicate patient entries, overwhelmed phone lines |
| **Goals** | Register a patient in under 60 seconds, find any patient record in under 10 seconds |
| **UX Priority** | Keyboard-friendly, search-first design, auto-complete fields, minimal required fields |

### Persona 4: Admin Asif (Hospital Administrator)
| Attribute | Detail |
|-----------|--------|
| **Age** | 38 |
| **Role** | Hospital Administrator |
| **Digital Literacy** | High — uses Excel, ERP systems |
| **Needs** | Revenue reports, patient statistics, staff scheduling, billing oversight, inventory tracking |
| **Pain Points** | No centralized reporting, manual reconciliation, can't track hospital KPIs in real-time |
| **Goals** | Real-time dashboard of all hospital operations, data-driven resource allocation |
| **UX Priority** | Dashboards, charts, exportable reports, drill-down analytics |

### Persona 5: Dr. Gohar Yousafzai (Managing Director)
| Attribute | Detail |
|-----------|--------|
| **Age** | 50 |
| **Role** | Founder & Managing Director, General Surgeon |
| **Digital Literacy** | Moderate — delegates technical tasks |
| **Needs** | High-level performance metrics, financial overview, operational bottlenecks, quality indicators |
| **Pain Points** | Can't see hospital-wide performance at a glance, relies on verbal reports |
| **Goals** | Data-driven hospital management, expansion planning, quality improvement tracking |
| **UX Priority** | Executive dashboard, key metrics, trend analysis, exception alerts |

### Persona 6: Patient Ahmed (Patient / Family)
| Attribute | Detail |
|-----------|--------|
| **Age** | 35 |
| **Role** | Patient / Family Member |
| **Digital Literacy** | Low — basic smartphone user |
| **Needs** | Appointment booking, test results, billing info, prescription access |
| **Pain Points** | Long waiting times, unclear processes, language barriers |
| **Goals** | Easy appointment booking, clear communication about their care |
| **UX Priority** | Minimalist interface, Urdu/Pashto support (future), large text, clear calls-to-action |

---

## 4. UX Strategy & HCI Principles

### Design Philosophy
**"Healthcare deserves great design."** The system treats every user interaction with the same care a doctor treats a patient.

### HCI Principles Applied

| Principle | Implementation |
|-----------|---------------|
| **User-Centered Design** | Continuous user research with actual hospital staff; design decisions based on real workflows at Gohar Hospital |
| **Clear Information Hierarchy** | Most critical information (patient name, alerts, status) always visible; secondary info behind progressive disclosure |
| **Minimal Cognitive Load** | No more than 7±2 options per screen; consistent patterns; reduce short-term memory burden |
| **Consistency** | Same navigation patterns, terminology, color coding, and interaction models across all modules |
| **Visibility of System Status** | Every action provides feedback: loading states, success confirmations, error messages, progress indicators |
| **Error Prevention** | Confirmation dialogs for destructive actions, form validation before submission, undo capabilities |
| **Accessibility** | WCAG 2.1 AA compliance, keyboard navigation, screen reader support, sufficient color contrast |
| **Efficient Workflows** | Expert users (doctors) get keyboard shortcuts and power features; novice users get guided workflows |
| **Feedback & Response** | All actions show immediate feedback via toast notifications, optimistic UI updates via Convex |
| **Recognition over Recall** | Search-first design, auto-complete, recent items, saved preferences |

### UX Design System Rules

1. **Touch Targets:** Minimum 44×44px for all interactive elements
2. **Typography:** System font stack for performance; `Inter` for headings (16px base, 1.5 line height)
3. **Spacing:** 8px grid system; 4px micro-spacing; 16px/24px/32px component spacing
4. **Colors:** Medical green primary (`#0A5C36`), calm blue secondary (`#1A6B9A`), amber accent (`#E8A838`)
5. **Loading States:** Skeleton screens for initial load; spinner overlays for mutations
6. **Empty States:** Never show blank screens — always provide helpful guidance
7. **Error States:** Clear error messages with suggested actions, never technical jargon
8. **Forms:** Inline validation, smart defaults, grouped fields, progress indicator for multi-step
9. **Data Tables:** Sortable columns, search, filter chips, pagination with page size selector
10. **Mobile:** Fully responsive; sidebar becomes drawer; tables become cards on small screens

### Role-Optimized Experiences

| Role | Default Landing | Key Modules | Interface Complexity |
|------|----------------|-------------|---------------------|
| **Doctor** | Clinical Dashboard | Patients, Appointments, Medical Records, Prescriptions | Moderate — clinical terminology |
| **Nurse** | Ward Overview | Patients (view), Vitals Entry, Bed Management, MAR | Simple — large touch targets |
| **Receptionist** | Appointment Queue | Patient Registration, Appointments, Search | Moderate — keyboard heavy |
| **Pharmacist** | Pharmacy Dashboard | Prescriptions, Inventory, Dispensing | Moderate — form heavy |
| **Lab Technician** | Lab Worklist | Lab Orders, Results Entry | Moderate — data entry |
| **Radiologist** | Imaging Worklist | Radiology Orders, Report Writing | Moderate — report writing |
| **Billing Staff** | Billing Dashboard | Invoices, Payments, Insurance Claims | Moderate — financial focus |
| **HR** | Staff Dashboard | Staff Profiles, Scheduling, Attendance | Moderate — scheduling focus |
| **Admin** | Operations Dashboard | All modules + Admin Settings, Audit Logs | Complex — full system access |
| **Super Admin** | Executive Dashboard | Full access + System Configuration | Complex — maximum control |

---

## 5. Architecture Decisions

### Technology Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Backend** | Convex (serverless) | Real-time subscriptions, ACID transactions, file storage, scheduled jobs — all in one platform |
| **Database** | Convex Document Store | Flexible schema for medical data; automatic indexing; no migration headaches |
| **Frontend** | React 18 + TypeScript | Type safety for medical data; vast ecosystem; long-term support |
| **UI Library** | shadcn/ui + Tailwind | Accessible primitives; design system control; no bloat |
| **Auth** | Convex Auth | Built-in JWT; OAuth ready; no separate auth server |
| **Animations** | Framer Motion | Tasteful micro-interactions; performant; accessible reduced-motion support |
| **Hosting** | Freebuff Cloud | Vite static + Convex serverless; zero DevOps |

### Why NOT Traditional Architecture

| Alternative | Why Not |
|-------------|---------|
| **Separate Node.js/Express backend** | Adds deployment complexity, server management, slower time-to-market |
| **SQL database** | Medical data is highly varied — document model suits patient records, clinical notes, lab results better |
| **Redux/Zustand for state** | Convex's reactive queries eliminate the need for client-side state management for server data |
| **Next.js** | Adds SSR complexity; this is a dashboard-heavy app, CSR with Convex is simpler |
| **External Auth0/Firebase Auth** | Convex Auth integrates natively; no context-switching between providers |

### Database Design Principles

1. **One collection per bounded context** — Patients, Appointments, MedicalRecords each own their data
2. **Document references via `v.id()`** — Relational queries via Convex's `ctx.db.get()` pattern
3. **Index everything queried** — Every `withIndex()` call has a corresponding index definition
4. **Audit trail is immutable** — `auditLogs` table is append-only, never updated or deleted
5. **Soft deletes via status field** — No hard deletes on clinical data; `isActive` / `status` fields used instead
6. **Timestamps in milliseconds** — JavaScript `Date.now()` consistency across the system

### RBAC Design

- **9 roles + 13 modules** — Each role has explicit CRUD permissions per module
- **Server-enforced** — Every Convex function checks permissions before executing
- **UI-reflected** — Menus, buttons, and routes are conditionally shown based on role
- **Audit trail** — Every access to PHI is logged with user, action, and timestamp

---

## 6. Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#0A5C36` | Primary actions, active states, branding |
| `--primary-foreground` | `#FFFFFF` | Text on primary backgrounds |
| `--secondary` | `#1A6B9A` | Secondary buttons, secondary headings |
| `--accent` | `#E8A838` | Highlights, warnings, attention |
| `--destructive` | `#C53030` | Errors, cancellations, critical alerts |
| `--success` | `#2F855A` | Confirmations, completed status |
| `--background` | `#F8FAFC` | Page backgrounds |
| `--sidebar` | `#0A3D24` | Navigation sidebar (dark green) |
| `--card` | `#FFFFFF` | Card/surface backgrounds |
| `--muted` | `#F1F5F9` | Subtle backgrounds |

### Typography

- **UI Font:** System font stack (`system-ui, -apple-system, sans-serif`)
- **Scale:** 12px / 14px / 16px / 18px / 24px / 30px / 36px
- **Heading Weight:** 700 (bold)
- **Body Weight:** 400 (regular)
- **Code:** `ui-monospace, SFMono-Regular, monospace`

### Spacing Scale

- **4px** — Micro spacing (icon gaps)
- **8px** — Tight spacing (between related elements)
- **16px** — Standard spacing (between components)
- **24px** — Section spacing
- **32px** — Page section spacing
- **48px** — Major section spacing

### Shadows

- **Card:** `0 1px 3px rgba(0,0,0,0.08)`
- **Dropdown:** `0 4px 12px rgba(0,0,0,0.12)`
- **Modal:** `0 20px 60px rgba(0,0,0,0.2)`
- **Sidebar:** `2px 0 8px rgba(0,0,0,0.06)`

---

## 7. Features Completed (Phase 1)

| Feature | Status | Details |
|---------|--------|---------|
| Vite + React + TypeScript project | ✅ Done | Fast build with path aliases |
| Tailwind CSS + PostCSS | ✅ Done | Medical theme with custom tokens |
| shadcn/ui primitives | ✅ Done | Button, Card, Input, Badge, Avatar, Select, Textarea, Separator, Skeleton, Label |
| Framer Motion | ✅ Done | Page transitions and micro-interactions |
| Convex backend setup | ✅ Done | 18 tables with full schema, indexes, and validation |
| Convex Auth | ✅ Done | Auth config with local dev |
| RBAC permission system | ✅ Done | 9 roles × 13 modules permission matrix |
| User management module | ✅ Done | Create, update, deactivate, list users with RBAC |
| App shell layout | ✅ Done | Responsive sidebar (desktop fixed + mobile drawer) |
| Top navigation bar | ✅ Done | Search, notifications, user menu |
| Dashboard page | ✅ Done | 6 KPI stat cards, quick actions, activity feed |
| Auth page | ✅ Done | Login form with hospital branding |
| 404 page | ✅ Done | Branded error page |
| Route guards (RequireAuth) | ✅ Done | Auth protection with return-to redirect |
| Routing structure | ✅ Done | All module routes with placeholders |
| Environment config | ✅ Done | VITE_CONVEX_URL configured for local dev |
| Folder structure | ✅ Done | Matches ARCHITECTURE.md specification |
| TypeScript compilation | ✅ Done | Zero errors |
| Convex functions deployment | ✅ Done | All 18 tables with 55+ indexes live |
| ARCHITECTURE.md | ✅ Done | Comprehensive architecture document |
| AI_CONTEXT.md | ✅ Done | This file — product vision, personas, UX strategy |
| **Patient Management (Phase 2.1)** | ✅ **Done** | **Full module: CRUD, MRN generation, search, detail view** |
| Patient Convex mutations | ✅ Done | createPatient, updatePatient, updatePatientStatus, deletePatient |
| Patient Convex queries | ✅ Done | getPatient, getPatientByMRN, listPatients, searchPatients, getPatientCount |
| MRN auto-generation | ✅ Done | GMT-YYYY-XXXXX format with collision retry |
| Patient registration form | ✅ Done | Multi-section form (personal, address, emergency, medical, insurance) |
| Patient list page | ✅ Done | Search by name/MRN/phone, filter by status, data table |
| Patient detail page | ✅ Done | Tabbed view (overview, medical, appointments, billing) |
| Patient edit page | ✅ Done | Pre-filled form with full edit capability |
| DataTable component | ✅ Done | Sortable, filterable, reusable table |
| SearchInput component | ✅ Done | Debounced search with clear button |
| StatusBadge component | ✅ Done | Colored status indicator |
| EmptyState component | ✅ Done | Placeholder with icon, description, action |
| Patient routes | ✅ Done | /patients, /patients/new, /patients/:id, /patients/:id/edit |

---

## 8. Features Pending (Next Phases)

### Phase 2 — Core Clinical Modules (NEXT)

| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| ✅ **Patient Management** | ✅ **Done** | **Full CRUD, search, detail, edit** |
| Department Management | 🟡 High | 1 day | CRUD for hospital departments |
| Room & Bed Management | 🟡 High | 2 days | Room types, bed capacity, occupancy tracking |
| Appointment Scheduling | 🔴 Critical | 3 days | Calendar view, slot management, booking |
| Admission / Discharge / Transfer | 🟡 High | 2 days | Bed assignment workflow |
| Medical Records (EHR) | 🔴 Critical | 3 days | SOAP notes, vitals, attachments |

### Phase 3 — Ancillary Services

| Feature | Priority | Effort |
|---------|----------|--------|
| Lab Information System | 🟡 High | 3 days |
| Radiology / Imaging | 🟡 High | 2 days |
| Pharmacy / Prescriptions | 🟡 High | 3 days |
| Inventory Management | 🟡 High | 3 days |
| Stock Alerts | 🟢 Medium | 1 day |

### Phase 4 — Financial & Admin

| Feature | Priority | Effort |
|---------|----------|--------|
| Billing & Invoicing | 🟡 High | 3 days |
| Payment Tracking | 🟡 High | 2 days |
| Insurance Claims | 🟢 Medium | 2 days |
| Financial Reports | 🟢 Medium | 2 days |
| Admin Panel | 🟡 High | 2 days |

### Phase 5 — HR & Operations

| Feature | Priority | Effort |
|---------|----------|--------|
| Staff Directory | 🟢 Medium | 2 days |
| Shift Scheduling | 🟢 Medium | 3 days |
| Attendance Tracking | 🟢 Medium | 2 days |

### Phase 6 — Reporting & Polish

| Feature | Priority | Effort |
|---------|----------|--------|
| Custom Report Builder | 🟢 Medium | 3 days |
| Operational Dashboards | 🟢 Medium | 2 days |
| PDF Export | 🟢 Medium | 1 day |
| Notification System | 🟢 Medium | 2 days |
| Performance Optimization | 🟢 Medium | 2 days |

---

## 9. AI Capabilities Roadmap

### Phase 7 (Future) — AI Integration

| AI Feature | Description | Data Required | Privacy Consideration |
|------------|-------------|---------------|----------------------|
| **AI Patient Assistant** | Chatbot for appointment booking, FAQs, hospital info | Public hospital data, appointment types | No PHI needed |
| **Symptom Pre-Screening** | Patients describe symptoms, AI suggests relevant department | Symptom → Department mapping | Minimal — no identity required |
| **Smart Appointment Guidance** | AI recommends best doctor/slot based on symptoms and availability | Department schedules, doctor specialties | Aggregate data only |
| **Medical Report Summarization** | AI summarizes lab reports and clinical notes into patient-friendly language | Lab results, clinical notes | PHI — needs on-device or private deployment |
| **Clinical Decision Support** | Drug interaction checks, allergy alerts, guideline suggestions | Prescriptions, patient allergies, medical knowledge base | PHI — on-server processing |
| **Hospital Analytics Insights** | AI identifies patterns: peak hours, common diagnoses, resource utilization | Aggregate operational data | Aggregated, de-identified |
| **Urdu/Pashto Voice Interface** | Voice-based interaction in local languages for low-literacy users | Voice input processing | No PHI in queries |

### AI Architecture Principles

1. **Privacy-Preserving by Default** — AI features are designed to minimize PHI exposure
2. **On-Premise Option** — For PHI-touching AI features, prefer models that can run locally
3. **Human-in-the-Loop** — AI suggestions are always advisory; clinicians make final decisions
4. **Auditable** — All AI recommendations are logged for review
5. **Gradual Introduction** — Start with no-PHI features first, build trust before clinical AI

---

## 10. UX Decisions Log

| Date | Decision | Rationale | Replaces |
|------|----------|-----------|----------|
| 2026-07-30 | Use Convex over traditional backend | Serverless, real-time, no DevOps | Initial plan for Express + PostgreSQL |
| 2026-07-30 | Medical green primary color | Evokes trust, health, aligns with hospital branding | Generic blue |
| 2026-07-30 | 9 roles with explicit permissions | Clear separation of duties per hospital hierarchy | Simpler 3-role system |
| 2026-07-30 | Sidebar navigation over top nav | Healthcare apps need many navigation items; sidebar scales better | Top navigation |
| 2026-07-30 | Search-first patient lookup | Receptionists need instant access; faster than browsing lists | Paginated table only |
| 2026-07-30 | Urdu/Pashto support deferred to AI phase | Foundation needs to be solid first; i18n added when AI voice features land | Initial plan for day-1 i18n |
| 2026-07-30 | Mobile drawer sidebar | Responsive design needed for on-the-go doctor access | Desktop-only sidebar |
| 2026-07-30 | Dark sidebar theme | Reduces eye strain for staff working night shifts | Light sidebar |
| 2026-07-30 | Sonner toast system added | User feedback for successful/error operations | No toast notifications |
| 2026-07-30 | Patient form uses card sections | Groups related fields (personal, address, emergency, medical) reducing cognitive load | Single long form |
| 2026-07-30 | Soft-delete pattern for patients | Status change to 'inactive' instead of hard delete — clinical data must be retained | Hard delete |
| 2026-07-30 | Client-side search for patients | Acceptable for <10k patient records; avoids adding a search service dependency | Convex full-text search (not available natively) |
| 2026-07-30 | DataTable uses role=button for rows | Keyboard-accessible row clicks (Enter/Space) | Click-only interaction |

---

## 11. Development Standards

### Code Quality

- **TypeScript strict mode** — No `any` unless absolutely necessary
- **No unused imports/variables** — Enforced by `noUnusedLocals` and `noUnusedParameters`
- **Consistent naming** — `camelCase` for variables/functions, `PascalCase` for components/types
- **Module boundaries** — Each domain module has its own `queries.ts`, `mutations.ts`, `validators.ts`

### Commit Convention

Since Freebuff handles commits through the Changes panel, no specific commit convention is enforced. However, changes should be logically grouped per module.

### Testing Strategy (Future)

- **Convex functions:** Unit tests with Convex's test framework
- **React components:** Vitest + React Testing Library
- **E2E:** Playwright for critical workflows (patient registration, appointment booking)

---

## 12. Environment & Deployment

### Current Environment

- **Freebuff Cloud** — Preview hosting
- **Convex** — Local deployment (port 3210) for development
- **Node.js** v22.23.1
- **Bun** 1.3.14

### Required Environment Variables

| Variable | Status | Source |
|----------|--------|--------|
| `VITE_CONVEX_URL` | ✅ Set (local) | Auto-generated by `convex dev` |
| `CONVEX_DEPLOYMENT` | ✅ Set (local) | Auto-generated by `convex dev` |

### Preview Commands

| Command | Value | Port |
|---------|-------|------|
| Install | `bun install` | — |
| Dev/Preview | `bun run dev` | 5173 |
| Build | `bun run build` | — |

---

## 13. Key Links & References

- **Hospital Website:** https://goharhospital.com/
- **About Page:** https://goharhospital.com/about-us/
- **Repository:** Mehtab20/Gohar-Medical-Trust
- **Convex Docs:** https://docs.convex.dev/
- **shadcn/ui Docs:** https://ui.shadcn.com/
- **Framer Motion:** https://motion.dev/

---

## 14. Project File Tree (Current)

```
gohar-medical-trust/
├── convex/
│   ├── _generated/
│   ├── auth.config.ts
│   ├── auth.ts
│   ├── constants.ts
│   ├── helpers/permissions.ts
│   ├── schema.ts
│   ├── seed.ts
│   └── users/
│       ├── mutations.ts
│       └── queries.ts
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   ├── page-container.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── topbar.tsx
│   │   └── ui/
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── skeleton.tsx
│   │       └── textarea.tsx
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-current-user.ts
│   │   └── use-media-query.ts
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── format.ts
│   │   ├── permissions.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── appointments/index.tsx
│   │   ├── auth/index.tsx
│   │   ├── dashboard/index.tsx
│   │   ├── not-found.tsx
│   │   └── patients/index.tsx
│   ├── providers/
│   │   ├── auth-provider.tsx
│   │   └── theme-provider.tsx
│   ├── types/
│   │   └── index.ts
│   ├── vite-env.d.ts
│   ├── index.css
│   ├── main.tsx
│   └── App.tsx
├── .env.local
├── .gitignore
├── ARCHITECTURE.md
├── AI_CONTEXT.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 15. When Making Changes

**BEFORE making any change:**
1. Read this file to understand current project context
2. Check which phase we're in
3. Understand the user personas affected

**AFTER making any change:**
1. Update the relevant section in this file
2. Update the "Features Completed" or "Features Pending" sections
3. Update the "UX Decisions Log" if a UX decision was made
4. Run `bun tsc -b --noEmit` to verify type safety
5. Run `bun convex dev --once` if Convex functions changed

---

*This document is a living artifact. It grows with the project and reflects our collective understanding of what we're building and why.*

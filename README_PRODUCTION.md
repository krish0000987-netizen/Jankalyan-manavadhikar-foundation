# Jankalyan Manavadhikar Foundation — Production Portal & Admin CMS

Complete enterprise-grade Scholarship Management System, Content Management System (CMS), and Administrative Portal for the **Jankalyan Manavadhikar Foundation**.

Built with **React 18 + Vite**, **Vanilla CSS Design System**, and backed by **PostgreSQL 17 on Supabase** with Row-Level Security (RLS) and Role-Based Access Control (RBAC).

---

## 🌟 Key Highlights & Architectural Features

1. **Zero Mock / Browser-Local Fallback as Primary Truth**:
   - All scholarship applications, documents, verification logs, DBT payment batches, audit trails, and CMS contents persist directly to the production Supabase database.
2. **6-Tier Role-Based Access Control (RBAC)**:
   - `SUPER_ADMIN`: Unrestricted global authority across all 20+ portal modules.
   - `DISTRICT_COORDINATOR`: Geographic jurisdiction scoping to assigned district records.
   - `BLOCK_COORDINATOR`: Block-level scrutiny and recommendations.
   - `INSTITUTION`: School/College Nodal Officers verifying enrolled applicants.
   - `ONLINE_CENTER`: CSC center operators facilitating student registrations and tracking commissions.
   - `STUDENT`: Applicant portal with timeline tracking, QR receipt, DBT status, and digital certificate view.
3. **Zero-Code Dynamic CMS**:
   - Hero slides (image/video banner, headlines, bilingual CTAs, auto-rotation interval).
   - Official announcements ticker.
   - Press releases, circulars & notices with priority tagging (`NORMAL`, `HIGH`, `CRITICAL`).
   - Frequently Asked Questions (bilingual accordion).
   - Team members directory and leadership profiles.
   - Official downloads registry (PDF/DOCX) backed by Supabase Storage.
   - System settings (grant amount, application window dates, contact coordinates).
4. **Direct Benefit Transfer (DBT) & Payment Batches**:
   - Batch creation for approved applicants.
   - UTR number assignment, payment reconciliation, and audit logs.
   - Pluggable `PaymentProvider` abstraction supporting manual DBT transfer, Razorpay, Cashfree, and PayU.
5. **Digital Certificates & Public QR Verification**:
   - Award certificates generated with unique verification tokens.
   - Public QR verification landing page at `/verify/application/:id` and `/verify/certificate/:token`.
   - Printable certificate layout with gold borders, emblem watermark, and officer signatures.
6. **Data Privacy & Security Compliance**:
   - Aadhaar plaintext is **never** stored or returned. Masked strings (`XXXX-XXXX-1234`) and SHA-256 hashes are used for deduplication.
   - Public tracking masks beneficiary names (`P**** S*****`) and suppresses sensitive bank credentials.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite 8, Lucide React icons, Canvas-based QR generator (`qrcode`).
- **Backend / Database**: Supabase PostgreSQL 17 with 51 tables, Stored Procedures, Functions, and Triggers.
- **Storage**: 7 Supabase Storage Buckets (`student-documents`, `profile-photos`, `institution-documents`, `downloads`, `cms-media`, `certificates`, `exports`).
- **Security**: PostgreSQL Row Level Security (RLS) on all 51 tables with Security Definer helper functions.

---

## 📂 Project Structure

```
├── index.html                      # Entry HTML with bilingual font definitions
├── src/
│   ├── api/
│   │   ├── supabase.js             # Supabase client initialization
│   │   └── storage.js              # Storage upload, signed URLs, and file validator
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminSidebar.jsx    # 20+ module navigation with role filtering
│   │   │   ├── AdminTopNav.jsx     # Role switcher, notifications, profile
│   │   │   └── ApplicationScrutinyModal.jsx # Full verification dossier
│   │   ├── common/
│   │   │   └── QrCodeDisplay.jsx   # Dynamic QR code renderer
│   │   ├── Header.jsx              # Navigation header with role portal gateway
│   │   └── Footer.jsx              # Official footer with legal links
│   ├── context/
│   │   ├── AppContext.jsx          # Supabase-connected application context
│   │   └── translations.js         # Complete Hindi/English localization strings
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminLogin.jsx      # Password-authenticated staff portal
│   │   ├── Admin.jsx               # Master administrative workspace
│   │   ├── Apply.jsx               # 8-step online scholarship application form
│   │   ├── CertificateView.jsx     # Award certificate with print stylesheets
│   │   ├── Contact.jsx             # Official contacts & inquiry submission
│   │   ├── Documents.jsx           # Student document upload & scrutiny status
│   │   ├── Downloads.jsx           # Official download center
│   │   ├── FAQ.jsx                 # Bilingual FAQs
│   │   ├── Grievance.jsx           # Student complaint registration & tracking
│   │   ├── Home.jsx                # Dynamic homepage with CMS slides & live counters
│   │   ├── QrVerify.jsx            # Public QR verification landing page
│   │   ├── Scholarship.jsx         # Scheme criteria, eligibility rules, guidelines
│   │   ├── StudentDashboard.jsx    # Student portal with stage progress & DBT details
│   │   └── Track.jsx               # Public non-sensitive status tracking
│   └── services/
│       ├── applicationService.js   # Atomic submissions, scoped queries, counters
│       ├── auditService.js         # Immutable audit logging
│       ├── authService.js          # Supabase auth, roles, and jurisdictions
│       ├── certificateService.js   # Award certificate generation & verification
│       ├── cmsService.js           # Full CRUD for hero slides, notices, FAQs, etc.
│       ├── commissionService.js    # Coordinator & online center commissions
│       ├── donorService.js         # CSR donor registry & fund allocation
│       ├── grievanceService.js     # Helpdesk tickets & message threads
│       ├── meritService.js         # Configurable merit lists & ranking rules
│       ├── notificationService.js  # Bilingual dispatching & templates
│       ├── paymentService.js       # DBT batches, UTR assignment, gateway abstraction
│       ├── reportService.js        # Dynamic analytics & CSV exports
│       └── scrutinyService.js      # Scrutiny transitions & verification history
├── supabase/
│   └── migrations/                 # 10 comprehensive SQL migration files
└── scripts/
    ├── verify_system.mjs           # Automated end-to-end test suite
    └── seed_payment_batch.mjs      # Payment batch & certificate seeder
```

---

## 🔑 Environment Variables Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://qvtrplnxipcagqozjdop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_-UN70l96CPJvEEqrGdNhiQ_bAYUaM1I

# Portal Defaults
VITE_APP_NAME="Jankalyan Manavadhikar Foundation"
VITE_DEFAULT_ACADEMIC_YEAR="2026-27"
VITE_PORTAL_VERSION="2.0.0"
```

> [!IMPORTANT]
> Never expose `service_role` key in frontend code or client-side `.env` variables. Only `VITE_SUPABASE_ANON_KEY` should be used in frontend clients.

---

## 👥 Seeded Demo Staff & Student Accounts

The database includes verified test accounts ready for login at `/admin/login`:

| Role | Email | Password | Scope / Jurisdiction |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@jankalyan.org` | `Admin@JMF2026!` | Global / All Modules |
| **District Coordinator** | `district.jabalpur@jankalyan.org` | `District@JMF2026!` | Jabalpur District |
| **Block Coordinator** | `block.patan@jankalyan.org` | `Block@JMF2026!` | Patan Block |
| **School Nodal Officer**| `school.model@jankalyan.org` | `School@JMF2026!` | Govt Model HSS |
| **Online CSC Center** | `center.patan@jankalyan.org` | `Center@JMF2026!` | Patan CSC Center |
| **Student Beneficiary** | `student.pooja@example.com` | `Student@JMF2026!` | `JMF-2026-108234` |

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run test verification suite (validates live Supabase connectivity)
node scripts/verify_system.mjs

# 3. Start local development server
npm run dev

# 4. Build for production deployment
npm run build
```

---

## 🧪 Verification & Health Check

The repository includes an automated test runner `scripts/verify_system.mjs` verifying:
- Live Vite dev server availability (Status 200).
- Dynamic CMS hero slides, notices, FAQs, and downloads queries.
- Supabase Auth password authentication.
- Role resolution via `user_roles`.
- Relational joins across applications, students, academic records, and banks.
- Application ID sequential generation (`JMF-2026-XXXXXX`).
- Real-time aggregated public counters.
- Public tracking lookup with privacy masking.
- Grievance ticket creation, resolution notes, and tracking.
- DBT Payment Batches and UTR transactions.
- Contact inquiry form submission.
- Digital certificate token validation.

To run tests:
```bash
node scripts/verify_system.mjs
```
Expected output: **18/18 checks PASSED (100%)**.

---

## 🔒 Security & Row Level Security (RLS) Policies

All 51 tables enforce PostgreSQL Row Level Security:
- **Public**: Can read active CMS sections, hero slides, announcements, notices, FAQs, downloads, and schemes. Can submit new applications, submit contact inquiries, and track applications/grievances.
- **Students**: Can view and update only their own profile, applications, documents, bank details, and grievance tickets.
- **Coordinators & Institutions**: Restricted to applications and beneficiaries within their assigned district (`district_id`), block (`block_id`), or institution (`institution_id`).
- **Super Admin**: Evaluated through `public.is_super_admin(auth.uid())` for unrestricted access.

# Invoice Dashboard — Supabase Setup

## 1. Apply the SQL schema

Open the Supabase SQL editor for project **jsgtdvyfjnastaewkqvu** and run [supabase/schema.sql](supabase/schema.sql). It creates every table and policy used by the app:

| Table              | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `profiles`         | 1 row per auth user (auto-created via trigger)       |
| `invoices`         | Sale invoices, FBR response, hash, status            |
| `invoice_items`    | Line items per invoice                               |
| `drafts`           | Quick-draft invoices before promotion                |
| `verifications`    | Every FBR sandbox roundtrip (request + response)     |
| `notifications`    | Per-user alerts (info / success / warning / critical)|
| `activity_log`     | Audit trail of user / system actions                 |
| `team_members`     | Org-level user roster                                |
| `user_preferences` | 2FA, privacy guard, email/push alert toggles         |
| `reports`          | Generated CSV / PDF / ZIP exports                    |
| `system_status`    | Online flag, archive usage, auto-purge days          |
| `user_sessions`    | Per-browser session history (for Security panel)     |

A signup trigger (`handle_new_user`) auto-creates the profile row + a welcome notification.

## 2. Environment variables

`.env` already contains your credentials:

```
VITE_SUPABASE_URL=https://jsgtdvyfjnastaewkqvu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_85MrijdbQ9QIMqvDTaBZAg_GuizJGhZ
VITE_FBR_BASE_URL=https://gw.fbr.gov.pk
VITE_FBR_TOKEN=d9defe7b-a7af-355f-9b8c-95b4e0d487d9
```

## 3. Run locally

```bash
npm install         # already done
npm run dev
```

The Vite dev server proxies `/fbr-api/*` to `https://gw.fbr.gov.pk` so the verification call works locally without CORS issues. In production, the included `supabase/functions/fbr-proxy/index.ts` edge function does the same job.

## 4. Production proxy

```bash
supabase functions deploy fbr-proxy --no-verify-jwt
supabase secrets set FBR_TOKEN=d9defe7b-a7af-355f-9b8c-95b4e0d487d9
supabase secrets set FBR_BASE=https://gw.fbr.gov.pk
```

The client (`src/services/fbr.js`) tries the edge function first in production and falls back to the dev proxy when running via `npm run dev`.

## 5. What's wired (everything)

| Area              | Behaviour                                                                          |
| ----------------- | ---------------------------------------------------------------------------------- |
| Auth              | `signInWithPassword` / `signUp`. Trigger creates profile + welcome notification.   |
| Route protection  | `/dashboard/*` requires session                                                    |
| TopBar            | Global search hits `invoices` and opens a result dropdown that links to detail page; profile menu has Settings / Notifications / Sign out |
| Dashboard         | StatCards (RPC), InvoiceChart (live monthly totals, CSV export, Full Report link), QuickActions (Verify / Draft / Upload CSV / Export CSV), SystemSecurity (live archive%), RecentActivity (live `activity_log`) |
| Invoices          | Live ValidationPreviewTable with paging + filters + global search; BulkUploadCard parses CSV → inserts rows; UploadStatusCards live counters with "Re-queue failed"; AdvancedFilters applies status/range/type/amount |
| Verification      | Single form posts to FBR sandbox via Vite proxy / edge function and records every call; Bulk tab parses a CSV and processes each row; sidecards download a CSV template and link to API docs; live VerificationStats + VerificationHistory |
| Drafts            | NewQuickDraft inserts a row (GST 18% auto-computed); DraftTable lists with edit / duplicate / delete / promote-to-invoice; DraftBottomCards show live pipeline totals |
| Invoice detail    | AuthCard pulls latest `verifications` row; LifecycleCard renders timeline from invoice + verification + activity log; VoidBanner has a real "Initiate Void" modal that updates status, logs activity, raises a notification; PDF/CSV/Duplicate buttons all work |
| Reports           | BulkExportCard generates a CSV and stores a `reports` row; VerificationReports lists / regenerates / deletes; SystemStatus reads `system_status`; DownloadHistory paginates `reports`; "Generate New Report" modal creates an entry |
| Settings          | ProfileDetails edits the profile; SecurityAccess toggles 2FA, changes password, shows live sessions, logs out other sessions; PrivacyGuard saves preferences; TeamManagement adds / edits / removes / resends invites (org-scoped); RolesLegend shows live member counts per role |
| Notifications     | Live list with category + tab + search; mark-as-read; archive; floating + button opens a Compose modal that inserts a new notification; NotificationStats and NotificationTypes counters are live |

## File map

| Path                                                  | Purpose                                |
| ----------------------------------------------------- | -------------------------------------- |
| `src/lib/supabase.js`                                 | Supabase client                        |
| `src/lib/AuthContext.jsx`                             | Auth provider (records sessions)       |
| `src/lib/SearchContext.jsx`                           | Global search query store              |
| `src/lib/export.js`                                   | CSV download + parser, PDF print       |
| `src/components/auth/ProtectedRoute.jsx`              | Auth gate                              |
| `src/components/common/PageTopBar.jsx`                | Shared top bar (used across pages)     |
| `src/components/common/Modal.jsx`                     | Tiny reusable modal                    |
| `src/services/invoices.js`                            | CRUD + filtered list                   |
| `src/services/drafts.js`                              | Drafts CRUD                            |
| `src/services/verifications.js`                       | Verification history + stats           |
| `src/services/notifications.js`                       | Notifications + stats + compose        |
| `src/services/activity.js`                            | Activity log                           |
| `src/services/profile.js`                             | Profile read/update                    |
| `src/services/team.js`                                | Team CRUD (org-scoped)                 |
| `src/services/preferences.js`                         | 2FA / privacy / password               |
| `src/services/reports.js`                             | Reports CRUD                           |
| `src/services/system.js`                              | System status, sessions                |
| `src/services/fbr.js`                                 | FBR sandbox POST + record verification |
| `supabase/functions/fbr-proxy/index.ts`               | Edge function for prod CORS bypass     |
| `supabase/schema.sql`                                 | Full DB schema + RLS policies + RPCs   |

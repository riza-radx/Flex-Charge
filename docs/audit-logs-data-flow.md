# Audit Logs Page — Data Flow

**Page:** `https://vegacharging.radx.app/#/rfid-cards/audit-logs`
**Question answered:** is the information on this page produced in the frontend or the backend?

> **Short answer: entirely the backend.** The Angular app fetches a page of records from `GET /api/v1/auditLog` and renders them. It creates, derives and computes nothing. Filtering, searching, date ranges and pagination are all performed server-side.

---

## 1. Request path

| Layer | Location | Responsibility |
|---|---|---|
| Route | [`rfid-card.routing.ts:177`](../src/app/pages/rfid-card/rfid-card.routing.ts) | `path: "audit-logs"` → `AuditLogComponent`, wrapped in `AuthGuard` |
| Component | [`audit-log.component.ts`](../src/app/pages/audit-log/audit-log.component.ts) | Holds filter + pagination state, calls the service, exposes `rows` to the template |
| Template | [`audit-log.component.html`](../src/app/pages/audit-log/audit-log.component.html) | Filter form and `ngx-datatable` rendering of `rows` |
| Service | [`audit-log.service.ts:28`](../src/app/services/auditLogService/audit-log.service.ts) | Builds the HTTP GET, attaches the bearer token |
| API (prod) | [`environment.prod.ts`](../src/environments/environment.prod.ts) | `https://api.radx.app/api/v1/auditLog` |

The URL is assembled as `${environment.apiUrl}/api/v1/auditLog`. Because `angular.json` uses `fileReplacements` to swap `environment.ts` for `environment.prod.ts`, production always resolves to `https://api.radx.app`.

---

## 2. The request

```
GET https://api.radx.app/api/v1/auditLog?<filters>&page=<n>&limit=<n>
Authorization: Bearer <authToken from localStorage>
Content-Type: application/json
withCredentials: true
```

Every filter the user types is forwarded to the server as a query parameter. Empty values are stripped before sending (`audit-log.service.ts:31-36`), so only populated filters are transmitted.

| Query param | Source in the UI |
|---|---|
| `search` | Free text box |
| `entity_type` | "Entity Type" (e.g. `User`, `Charger`) |
| `entity_id` | "Entity ID" |
| `action` | "Action" (`CREATE` / `UPDATE` / `DELETE`) |
| `status` | "Status" |
| `from`, `to` | Date range pickers |
| `page` | Previous / Next buttons |
| `limit` | "Show N entries" selector (10 / 25 / 50 / 100) |

**This is the key point:** none of these are applied client-side. The component never filters, sorts or slices `rows`. Changing any filter calls `loadLogs()`, which issues a fresh HTTP request and replaces the array wholesale.

---

## 3. The response

The component accepts four possible response shapes (`audit-log.component.ts:68-78`), because the backend contract was never fixed:

```ts
data.auditLogs   // preferred
data.logs
data.data
data            // bare array
```

Record count comes from `data.total ?? data.count ?? rows.length` (line 79).

### Fields the table displays

| Column | Field(s) read |
|---|---|
| ID | `id` / `audit_log_id` / `auditLogId` / `log_id` / `_id` |
| Date | `createdAt` / `created_at` / `date` / `timestamp` |
| Entity Type | `entity_type` |
| Entity ID | `entity_id` |
| Action | `action` |
| Actor | `actor_name` / `actor_id` / `user_id` |
| Status | `status` |
| Description | `description` / `message` / `details` / `note` / `comment`, falling back to a JSON dump of `changes` / `diff` / `payload` / `metadata` / `data` / `before` / `after` |

### The only frontend logic on this page

Two helper methods, both purely presentational:

- **`rowId(row)`** (line 138) — tries five possible ID field names
- **`rowDescription(row)`** (line 144) — tries five description field names, then falls back to `JSON.stringify` of whatever change/metadata field exists

Both are defensive fallback chains, written because the exact backend field naming was unknown at the time. They rename nothing and calculate nothing — they only pick whichever key happens to be present.

**Worth tidying:** once the backend response shape is confirmed, both chains and the four-way response-shape check can collapse to direct property access.

---

## 4. Console logging finding

Two debug statements print backend data straight into the browser DevTools console:

```ts
// audit-log.component.ts:81-82
if (this.rows.length > 0) {
  console.log('[AuditLog] first row keys:', Object.keys(this.rows[0]));
  console.log('[AuditLog] first row:', this.rows[0]);
}
```

These are leftover discovery scaffolding — a developer printing the backend's field names to work out the mapping that became `rowId()` and `rowDescription()`. They fire on every load and every filter change.

**What they expose:** a complete audit log record, including actor identity, entity IDs, and whichever of `payload` / `metadata` / `changes` / `before` / `after` that record carries. The `Description` column already truncates this JSON visually — the console prints it in full and expandable.

**Impact of removing them: none.** The data is backend-owned and already rendered in the table. These lines duplicate it onto a public surface and nothing else. The page behaves identically without them.

This is a specific instance of a codebase-wide issue — 2,365 active `console.*` statements across 223 files, none stripped from the production build. See [`tasks/plan.md`](../tasks/plan.md) for the full assessment and remediation plan.

---

## 5. Access control note

The component restricts the page to two roles (`audit-log.component.ts:41-49`):

```ts
this.userRole = localStorage.getItem('userRole');
const role = (this.userRole || '').toString().toLowerCase().replace(/[_\s-]/g, '');
this.isCompanyAdmin = role === 'companyadmin';
this.isRadXAdmin    = role === 'radxadmin';

if (!this.isCompanyAdmin && !this.isRadXAdmin) {
  this.router.navigate(['/dashboard']);
  return;
}
```

**This is a UX guard, not a security boundary.** Two reasons:

1. The role is read from `localStorage`, which any user can edit in DevTools.
2. The check runs in `ngOnInit`, and the redirect is client-side — a user who alters `userRole` reaches `loadLogs()` and the request is sent.

The bearer token is still validated by the API, so this is not an open door. But **the authorisation decision must be enforced by `/api/v1/auditLog` server-side**, scoped to the caller's actual role and company. If the endpoint only checks that the token is valid — not what role it carries — then any authenticated user can read the audit log by editing one `localStorage` value.

**Open question for the backend team:** does `/api/v1/auditLog` enforce the companyadmin / radxadmin restriction, and does it scope results to the caller's own company?

---

## Summary

| Concern | Where it lives |
|---|---|
| Audit record creation | Backend |
| Storage | Backend |
| Filtering / search / date range | Backend (query params) |
| Pagination and total count | Backend (`page`, `limit`, `total`) |
| Field-name normalisation | Frontend (`rowId`, `rowDescription`) — cosmetic only |
| Rendering | Frontend (`ngx-datatable`) |
| Authorisation | Frontend check is advisory — **must** be enforced backend-side |

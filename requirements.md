Starting (2/3) _Clarifying questions_

Here’s a clean Markdown questionnaire you can fill in. I’ll use your answers to lock the scope and start building the Expo app.

## Mobile App Setup

-   App name (store/display):
-   Platforms to support:
    -   [x] Android
    -   [ ] iOS
-   API base URLs:
    -   Dev: http://localhost:3000/api
    -   Staging: https://staging.your-stayscan-domain.com/api
    -   Prod: https://api.your-stayscan-domain.com

## Roles & Access

-   Roles needed:
    -   [x] Staff
    -   [x] Admin
-   Permission matrix (edit as needed):

| Capability                     | Staff | Admin |
| ------------------------------ | :---: | :---: |
| View incoming service requests |  ✅   |  ✅   |
| Update request status          |  ✅   |  ✅   |
| Assign/reassign requests       |  ❌   |  ✅   |
| View notifications             |  ✅   |  ✅   |
| Mark notifications as read     |  ✅   |  ✅   |
| View subscription              |  ❌   |  ✅   |
| Change subscription/plan       |  ❌   |  ✅   |
| View hotel info                |  ✅   |  ✅   |
| Edit hotel info                |  ❌   |  ✅   |

## Authentication

-   Preferred approach:
    -   [x] Dedicated mobile login endpoint returning JWT
    -   [ ] Reuse NextAuth session (cookie-based) — note: tricky on native
-   Login endpoint (if exists): /api/mobile/login (to add)
-   Token details:
    -   Token type: Bearer JWT
    -   Expiration: 1 hour
    -   Refresh token flow: Yes (endpoint: /api/mobile/refresh)
-   JWT claims needed (confirm):
    -   user.id
    -   user.role (staff/admin)
    -   user.hotelId
-   Logout behavior:
    -   [ ] Invalidate server session
    -   [x] Just delete local token

## Service Requests

-   List endpoint(s) (with filters/pagination):
    -   GET: /api/staff/service-requests
    -   Query params (status, priority, page, limit, hotelId): status, priority (page/limit to be added server-side)
-   Update/assign endpoints:
    -   PATCH status: /api/staff/service-requests (body: { requestId, status })
    -   PATCH assign staff: /api/staff/service-requests (admin only; body: { requestId, assignedStaffId })
-   Allowed status transitions (confirm):
    -   pending → in_progress → completed
    -   cancel? reopen?
-   Assignment rules:
    -   Can staff self-assign? [Yes/No] No
    -   Can reassign? [Yes/No] No
-   Fields to display in list:
    -   [x] title
    -   [x] priority
    -   [x] status
    -   [x] roomNumber
    -   [x] requested_at
    -   [ ] assigned_staff
    -   Other:
-   Pagination strategy:
    -   [x] page/limit (requires backend support; current API returns full filtered list)
    -   [ ] cursor-based
    -   [ ] load all (small datasets)

## Notifications

-   Strategy for v1:
    -   [ ] Polling existing /api/notifications
    -   [x] Push (Expo Notifications/FCM) — requires device-token registration
-   Endpoints:
    -   GET notifications: /api/notifications?limit=20
    -   PATCH mark read: /api/notifications (body: { notificationId } or { markAllAsRead: true })
    -   POST register device token: /api/notifications/device-tokens (to add)
-   Mark read behavior:
    -   [x] On opening notification list
    -   [ ] Explicit action only
-   Desired polling interval (if polling): [15s / 30s / 60s / other]
    -   30s (fallback only if push unavailable)
-   Background fetch allowed (periodic sync): [Yes/No] yes

## Subscription (Admin)

-   View endpoint: /api/hotel/profile (provides subscriptionPlan, subscriptionStatus)
-   Editable actions now:
    -   [x] View only
    -   [ ] Upgrade/downgrade
    -   [ ] Cancel/resume
-   Flow for upgrades:
    -   [ ] Backend API (server-to-Razorpay)
    -   [ ] Hosted checkout/webview
-   Fields to show:
    -   plan_type, billing_cycle, status, current_period_start, current_period_end, amount, currency, room_tier, razorpay ids
    -   Other: For v1, show subscriptionPlan/subscriptionStatus from hotel profile; extended billing fields TBD

## Hotel Info (Admin)

-   View endpoint: /api/hotel/profile (GET)
-   Update endpoint: /api/hotel/profile (PUT)
-   Editable fields (tick all that apply):
    -   [x] name
    -   [x] address
    -   [x] city/state/country
    -   [ ] contact_email
    -   [ ] contact_phone
    -   [ ] total_rooms
    -   [ ] other:
-   Validation constraints (emails/phone/lengths):
    -   Email: valid format; Phone: E.164; Name: 2–100 chars; Address fields: 2–200 chars
-   Lock edits if subscription inactive? [Yes/No] No (v1)

## Performance & Offline

-   Offline behavior:
    -   [x] Read-only cache when offline
    -   [ ] Queue status updates to sync later
-   Acceptable latency for refresh (requests/notifications): 30s
-   Max items per list fetch: 50

## Security

-   Token storage:
    -   [x] SecureStore (recommended)
    -   [ ] AsyncStorage (not recommended for prod)
-   Multiple device logins allowed? [Yes/No] Yes
-   Minimum OS versions:
    -   Android: 8.0 (API 26)
    -   iOS: N/A (Android only for v1)
-   PII/logging restrictions: Do not log PII; redact request/guest details in logs; scrub Sentry breadcrumbs of tokens/IDs

## UI/Brand

UI/Brand exact values (match web)
Colors

Primary (minion-yellow): #ffd700
Primary light: #fff59d
Primary dark: #f57f17
Secondary (minion-blue): #2196f3
Secondary light: #bbdefb
Secondary dark: #1976d2
Success: #4caf50
Warning: #ff9800
Error: #f44336
Info: #2196f3
Background: #fafafa
Foreground: #212121
Card background: #ffffff
Border: #e0e0e0
Border radius

--radius-minion: 16px
--radius-minion-lg: 24px
Typography

Headings: Montserrat (bold/semibold, tighter letter-spacing)
Body: Raleway
Web uses CSS variables for fonts: var(--font-raleway), var(--font-montserrat)
Common components styling cues (web)

Primary button: minion-yellow bg, dark text, rounded 16px, medium weight, subtle elevation
Secondary button: minion-blue bg, white text, rounded 16px
Inputs: 2px border, rounded 16px, focus border minion-yellow with soft glow
Cards: white bg, 1px subtle border, rounded 24px, soft shadow

## Repo & Code Sharing

-   Path to Expo app (stayscan_app): stayscan_app/
-   Share types with web?
    -   [ ] Create shared package (e.g., /packages/shared-types)
    -   [x] Copy minimal types to mobile
-   Allowed to add a small shared utils/types package? [Yes/No] No

## Testing & Deployment

-   Automated tests:
    -   [ ] Unit tests
    -   [x] Component tests
    -   [ ] Detox e2e (later)
-   First distribution targets:
    -   [ ] Internal APK
    -   [ ] TestFlight
    -   [x] Play Store / App Store later
-   Crash/error reporting:
    -   [x] Sentry RN
    -   [ ] Other:

## Future Roadmap

-   WebSockets for real-time (timeline): No
-   Guest-facing app later? [Yes/No] No
-   Additional modules (inventory, tasks, chat): No

## Timeline & Priorities

-   MVP must-have screens (rank):
    1. Login
    2. Dashboard (requests + notifications)
    3. Service Request details + update
    4. Subscription view (admin)
    5. Hotel info view/edit (admin)
-   Nice-to-have screens (rank):
    1. Profile/settings
    2. Help/support
    3. About
-   Phase durations (rough):
    -   Auth + Nav: 2–3 days
    -   Requests: 3–4 days
    -   Notifications: 2–3 days
    -   Subscription (view): 1–2 days
    -   Hotel info (edit): 2–3 days

Once you fill this in (even partially), I’ll lock the scope and start scaffolding the Expo app with the MVP screens.

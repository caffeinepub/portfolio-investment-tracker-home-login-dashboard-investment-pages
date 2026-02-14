# Specification

## Summary
**Goal:** Build a coherent portfolio & investment tracker with Internet Identity login, protected pages, per-user investment CRUD, a dashboard summary, consistent finance-themed styling, and static home/branding visuals.

**Planned changes:**
- Create frontend routes/pages: Home, Login, Dashboard, Investment, with persistent navigation that changes based on authentication state and includes a Log out action when signed in.
- Implement Internet Identity authentication wired to the Login page (sign in/sign out) and display the signed-in Principal.
- Add a single Motoko backend actor with caller-scoped CRUD APIs and data models for investment records (create, list, update, delete) persisted per Principal.
- Build the Investment page UI to list, create, edit, and delete investment records with clear English labels and inline validation (required + numeric fields).
- Build the Dashboard page to summarize the signed-in user’s investments (count, total invested amount, and breakdown by type/category if present), including empty-state handling and a link to the Investment page.
- Apply a consistent, distinct visual theme/layout across all pages suitable for a finance app (not primarily blue/purple).
- Add and render generated static assets for Home hero/branding from `frontend/public/assets/generated`, with responsive sizing and graceful fallback if unavailable.

**User-visible outcome:** Users can sign in with Internet Identity, navigate a multi-page app with protected Dashboard/Investment pages, manage their own investment records (add/edit/delete), and see portfolio summaries on the Dashboard, all within a cohesive styled UI and a Home page with static hero/branding visuals.

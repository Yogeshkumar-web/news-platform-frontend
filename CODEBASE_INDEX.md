# Frontend Codebase Index

Purpose: compact working map for future frontend changes. Read this first, then use `rg` and targeted file reads for source-of-truth details.

## Project Shape

- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, React Query, Axios, Zod, Lexical editor.
- Entry points:
  - `src/app/layout.tsx`: root layout.
  - `src/app/page.tsx`: homepage, server-fetches featured/latest articles and categories.
  - `src/app/globals.css`: global styles.
  - `src/proxy.ts`: request proxy plus route protection.
- Route groups:
  - `src/app/(public)`: public articles, category, privacy, terms.
  - `src/app/(auth)`: login, register, check-email, verify-email.
  - `src/app/(protected)`: authenticated shell for profile, dashboard, admin.
  - `src/app/api/auth/callback/route.ts`: OAuth callback handler.
  - `src/app/ads.txt/route.ts`, `robots.ts`, `sitemap.ts`, `manifest.ts`, `opengraph-image.tsx`: metadata/static routes.
- Shared UI/layout:
  - `src/components/layout`: header, footer, category nav, mobile nav, auth status.
  - `src/components/editor`: Lexical editor, image/YouTube nodes, upload/paste/drag plugins, image resizer.
  - `src/components/admin`, `src/components/dashboard`, `src/components/profile`, `src/components/article`, `src/components/ads`, `src/components/shared`, `src/components/ui`.

## API, Auth, And Proxy Wiring

- Client API wrapper: `src/lib/api/client.ts`.
  - Axios `baseURL` is `/api/proxy`.
  - Client code usually calls backend paths like `/api/articles`; the browser request becomes `/api/proxy/api/articles`.
  - Adds JSON headers, `withCredentials`, 30s timeout, and normalized Axios error objects.
- Server API wrapper: `src/lib/api/server.ts`.
  - Uses `process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"`.
  - Reads `token` from cookies and forwards both `Cookie` and `Authorization` headers.
  - Exports `serverFetch`, `serverGet`, `serverPost`, `serverPut`, `serverPatch`, `serverDelete`.
- Proxy and protection: `src/proxy.ts`.
  - Rewrites `/api/proxy/*` to the backend.
  - Injects auth token from cookie into proxied backend requests.
  - Redirects protected route access without token to `/login?redirect=...`.
- Session helpers:
  - `src/lib/auth/session.ts` uses `/api/auth/me` through `serverGet`.
  - `src/lib/auth/middleware-helper.ts` defines route protection helpers.

## Feature Modules

- Auth: `src/features/auth`
  - API: `api/auth-api.ts`.
  - Actions: login, register, logout, resend verification, verify email.
  - UI/hooks: login/register forms, Google login, OAuth loading/error, `useAuth`, `useLogout`.
- Articles: `src/features/articles`
  - API: `api/article-api.ts`, `api/saved-articles-api.ts`.
  - Actions: create/update article, upload article image, toggle like.
  - UI/hooks: article form, like/save buttons, saved list, delete/useArticle hooks.
- Comments: `src/features/comments`
  - API/actions for create/update/delete/list/stats.
  - UI/hooks: comment form, list, query/delete hooks.
- Categories: `src/features/categories`
  - API: `api/categories-api.ts`.
  - UI: category selector.
- Admin: `src/features/admin`
  - API/actions for system stats, users, categories, articles, comments.
  - UI: users/categories/comments tables, moderation tabs.
- Profile: `src/features/profile`
  - API/actions/components for profile update, avatar upload, password change.

## Types, Validation, Config

- Shared frontend types: `src/types/index.ts`.
- Validation schemas:
  - `src/lib/validation/schemas/auth-schema.ts`
  - `src/lib/validation/schemas/article.schema.ts`
  - `src/lib/validation/schemas/comment.schema.ts`
- Env schema: `src/lib/env/index.ts`.
  - Server vars include `API_BASE_URL`, `FRONTEND_URL`, `JWT_SECRET`, optional `ADSENSE_ID`.
  - Client vars include `NEXT_PUBLIC_DOMAIN`, `NEXT_PUBLIC_ADSENSE_ID`, `NEXT_PUBLIC_API_BASE_URL`.
- React Query setup: `src/lib/react-query`.
- Constants/utilities: `src/lib/constants/index.ts`, `src/lib/utils.ts`, `src/lib/utils/*`.

## Backend Endpoints Consumed

- Auth/profile:
  - `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/me`
  - `/api/auth/verify-email`, `/api/auth/resend-verification`
  - `/api/auth/profile`, `/api/auth/avatar`, `/api/auth/password-change`
  - `/api/auth/google`
- Articles/editor:
  - `/api/articles`, `/api/articles/:slug`, `/api/articles/category/:categoryName`
  - `/api/articles/my/articles`, `/api/articles/edit/:id`, `/api/articles/:id`
  - `/api/articles/:id/status`, `/api/articles/upload-image`, `/api/articles/admin/all`
  - `/api/articles/:articleId/like`, `/api/articles/:articleId/toggle-save`
- Comments:
  - `/api/comments/create`, `/api/comments/:articleId`, `/api/comments/stats/:articleId`
  - `/api/comments/:id`, `/api/comments/:id/status`
  - Frontend admin API expects `/api/comments/admin/all`.
- Categories:
  - `/api/categories`, `/api/categories/admin/all`, `/api/categories/:id`.
- Users/stats:
  - `/api/users`, `/api/users/:id/role`, `/api/users/:id/status`
  - `/api/users/me/saved-articles` is backend source of truth; one frontend API uses `/api/users/saved-articles`.
  - `/api/stats/system`, `/api/stats/dashboard`, `/api/stats/admin/system-config`.

## Known Hotspots

- API base URL config is inconsistent: client Axios uses `/api/proxy`, server fetch uses `NEXT_PUBLIC_API_BASE_URL`, and env schema also defines private `API_BASE_URL`.
- Some OAuth helpers in `src/lib/api/oauth.ts` call `/auth/me` and `/auth/logout`, while backend routes are under `/api/auth/*`.
- `src/features/profile/api/profile-api.ts` calls `/auth/change-password`; backend route is `/api/auth/password-change`.
- Saved articles path mismatch: frontend has `/api/users/saved-articles`; backend exposes `/api/users/me/saved-articles`.
- Admin comments list mismatch: frontend expects `/api/comments/admin/all`; backend currently defines `/api/comments/admin/recent`.
- User role update method mismatch: frontend admin action uses `PATCH /api/users/:id/role`; backend uses `PUT /api/users/:id/role`.

# Copilot instructions for rosebud-boutique-builder

Purpose: give AI agents the minimal project-specific context to ship safe, idiomatic changes fast.

## Big picture
- Stack: Vite + React 18 + TS + Tailwind + shadcn/ui + React Router + TanStack Query + Supabase (auth/DB/storage) + Axios (Noest Express).
- Entry: `src/main.tsx` renders `src/App.tsx` which wraps QueryClient + Language + Auth + Tooltips/Toasters + Router.
- Pages: `src/pages/` (Home, ProductDetail, Admin, NotFound). `/admin` is gated by `components/ProtectedRoute` using `contexts/AuthContext`.
- Data: Supabase tables back products, orders, delivery fees, Noest creds. SQL lives at repo root (e.g., `supabase_*_table.sql`).
- Shipping: Admin uploads order → `status = inséré` → manual validate → `status = expédié`.

## Key files
- `src/lib/supabaseClient.ts` public client (localStorage keys `belle-elle-auth`/`belle-elle-session`).
- `src/contexts/AuthContext.tsx` + `useAuth()` for session and auth.
- `src/contexts/LanguageContext.tsx` + `src/hooks/useLanguage.ts` for en/ar, `t(key)` and `isRTL`.
- `src/lib/noestApi.ts` service for create/validate/track; pulls `noest_express_config` from Supabase; strict payload validation.
- `src/lib/communeMapping.ts` wilaya/commune canon and helpers (`isValidCommune`, `suggestCommune`, `getDefaultCommune`, `VALID_WILAYA_IDS`).
- `src/lib/imageCompression.ts` compress to WebP ~100–200KB pre-upload. Used by `pages/Admin.tsx`.

## Dev/build/debug
- Install deps then run: dev `npm run dev`, preview `npm run preview`, build `npm run build`, lint `npm run lint`.
- CORS for Noest in dev: prefer Netlify dev (`npm run dev:netlify`) or hit Vite proxy path `/api/noest/...` (rewrites to `https://app.noest-dz.com/api/public`).

## Conventions
- Path alias `@/*` (tsconfig + vite). Example: `import { supabase } from '@/lib/supabaseClient'`.
- TypeScript not strict; keep changes incremental (don’t enable strict repo-wide).
- Products store image public URLs (Supabase Storage bucket `product-images`). Admin normalizes legacy CSV arrays with `cleanArrayField`—be defensive reading `colors/sizes/images`.
- Orders use French statuses: `pending`, `inséré`, `expédié` (exact strings). `stop_desk` 0/1 toggles stopdesk; default station codes derived from wilaya if missing.
- i18n: `const { t, isRTL } = useLanguage()`; set `dir` when building layouts; add new keys in `LanguageContext.tsx`.

## Data model (operational)
- `products`: title, price, oldprice?, weight, images[], description, colors[], sizes[]
- `orders`: client, phone, adresse, wilaya_id, commune, produit, montant, stop_desk, tracking?, is_validated?, status
- `delivery_fees`: wilaya_code, wilaya_name, home_delivery, stopdesk_delivery
- `noest_express_config`: api_token, guid, is_active? (single row)

## Integration tips
- Fetch Noest creds via `noestApiService.getConfig()`—don’t pass tokens from UI.
- Shape/validate orders like `uploadToNoest` in `pages/Admin.tsx`; ensure `poids` positive integer, `phone` 9–10 digits, `commune` valid via `communeMapping.ts`.
- In dev, call Noest via `/api/noest/...` to use Vite proxy.

## Examples
- Protected route: `<ProtectedRoute><Admin /></ProtectedRoute>` plus `<Route path="/admin" ... />`.
- i18n: `const { t } = useLanguage(); <span>{t('common.save')}</span>`.
- Supabase: `supabase.from('products').select('*').order('created_at', { ascending: false })`.

Open questions to confirm: standardize dev Noest calls on the Vite proxy? extract Admin Supabase logic into React Query hooks? Share preferences and we’ll refine.

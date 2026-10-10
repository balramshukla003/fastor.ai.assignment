# Fastor PWA frontend

Mobile-first React JSX + Vite + Tailwind application with centralized Axios API handling, OTP login flow, restaurant listing, product customization, local demo cart, profile screen, image fallbacks, skeleton loaders, and an installable PWA manifest.

## Run locally

```bash
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use `cp .env.example .env`.

## Configuration

Edit `.env`:

- `VITE_API_BASE_URL=https://staging.fastor.ai/v1/`
- `VITE_API_SIGNUP_ENDPOINT=/pwa/user/signup` (assumed default; confirm with backend)
- `VITE_API_LOGIN_ENDPOINT=/pwa/user/login` (provided endpoint)
- `VITE_API_RESTAURANTS_ENDPOINT=/pwa/restaurant/list` (assumed default; confirm with backend)
- `VITE_DEMO_MODE=false`

Only the login path was explicitly provided in the task. Confirm the signup and restaurant endpoint paths with the backend team and update `.env` if different. The signup request uses `application/x-www-form-urlencoded` with `phone` and `dial_code`. Login uses `phone`, `otp`, and `dial_code` as form-urlencoded fields.

## Important API behavior

- All HTTP calls go through `src/services/api/apiClient.js`.
- Base URL, shared headers, Bearer token injection, timeout and normalized errors are centralized.
- Signup does not authenticate the user; the OTP screen submits the OTP to `/pwa/user/login`.
- The login token is persisted for subsequent authenticated requests.
- Restaurant API falls back to mock data on a 404, or when `VITE_DEMO_MODE=true`. Other API errors remain visible.
- Restaurant response is expected to contain `data.results` and optional `data.meta`.
- Restaurant pagination metadata is preserved, but this demo currently requests page 1. Add pagination/infinite scrolling if the task requires all pages.

## Functional boundaries

- The cart is local demo state. There is no order/checkout API, so adding an item does not create a server-side order.
- Menu/product records are mock data because no menu API was supplied.
- No service worker or offline data caching is included, per requirement. The web app manifest enables PWA metadata/installability; serve over HTTPS for installation outside localhost.
- Images use remote Unsplash sources for demo products with a local SVG fallback. Replace these with provided/licensed project assets when available.
- Profile shows only safe display fields; password is explicitly removed before storing user data.

## Build

```bash
npm run build
npm run preview
```

## Security note

The API example includes a `password` property in the user response. The frontend intentionally removes it and never renders it. If the example token/password were real, rotate/revoke them.


### Cart
The desktop header and mobile bottom navigation both open `/cart`. The cart supports quantity changes, item removal, clearing the cart, and subtotal calculation. Cart contents are currently held in React state for the active session; checkout is a UI placeholder and does not submit an order.

# EasenChic Store (React + Vite)

A modern e-commerce UI with routing, cart, checkout, login via OTP, and polished UX (toasts and loaders).

## Quick Start

```bash
npm install
npm run dev
```

Open the app at the printed local URL (typically http://localhost:5173 or :5174).

## Features

- Multi-page routing: Home, Login, Product Detail, Checkout
- Cart with localStorage persistence
- Toast notifications (success, error, info)
- Loading dots overlay on route change
- Checkout page: delivery details, shipping method, order summary, coupon (EASEN10), payment selection
- WhatsApp widget stays green with logo; brand palette is chocolate/black/white

## Email OTP (Optional)

Client-side OTP works out-of-the-box (demo). To send real emails via EmailJS, create a `.env.local` file in the project root with:

```
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
```

In your EmailJS template, include variables `to_email` and `otp_code`.

## Pages

- `/` Home: product grid, filters, footer, WhatsApp widget
- `/login` Login/Register via email OTP
- `/product/:id` Product detail with options and quantity
- `/checkout` Checkout flow with order summary

## Coupons

- Use `EASEN10` for a 10% demo discount at checkout.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

# LYKAN CROP SCIENCE

Full-stack B2B agrochemical web application for LYKAN CROP SCIENCE, Rajkot, Gujarat.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **MongoDB Atlas** + Mongoose
- **next-intl** (English, Gujarati, Hindi)
- **Cloudinary** (product/banner images)
- **Razorpay** (payments)
- **Nodemailer** (email notifications)

## Quick Start

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in `.env.local` with your MongoDB URI, Cloudinary, SMTP, and Razorpay keys.

3. Install and run:
   ```bash
   npm install
   npm run seed
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- URL: `/admin/login`
- Default: `admin@lykancropscience.com` / `Lykan@2024`

## Seed Data

The seed script inserts all 129 products (brand + category only) and default admin/settings:

```bash
npm run seed
```

Admin can fill in technical names, doses, packing sizes, and images via the dashboard.

## Deployment (Vercel)

1. Push to GitHub and connect to Vercel
2. Add all env vars from `.env.example`
3. MongoDB Atlas: whitelist `0.0.0.0/0`
4. Run `npm run seed` once after first deploy

## Pages

| Route | Description |
|-------|-------------|
| `/en` | Home (also `/gu`, `/hi`) |
| `/en/products` | Product catalogue |
| `/en/products/[slug]` | Product detail |
| `/en/cart` | Shopping cart |
| `/en/checkout` | 3-step checkout |
| `/en/track-order` | Order tracking |
| `/en/contact` | Contact + map |
| `/en/about` | About + toxicity guide |
| `/admin` | Admin dashboard |

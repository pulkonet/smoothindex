# Project File Structure

## Core Application Files
- `src/app/layout.js` - Root layout component with ThemeProvider, Navigation and Footer
- `src/app/page.js` - Homepage with hero section, features, testimonials and pricing
- `src/app/globals.css` - Global styles and theme variables

## Main Features
1. Dashboard
   - `src/app/dashboard/page.js` - Main dashboard showing sites table
   - `src/app/dashboard/dashboard.module.css` - Dashboard styles

2. Sites Management
   - `src/app/sites/page.js` - Sites overview page
   - `src/app/sites/sites.module.css` - Sites page styles
   - `src/app/sites/[siteUrl]/page.js` - Individual site details
   - `src/app/sites/[siteUrl]/siteOverview.module.css` - Site details styles
   - `src/app/sites/[siteUrl]/pages/page.js` - Crawled pages list view
   - `src/app/sites/[siteUrl]/pages/pages.module.css` - Crawled pages styles

3. Analytics
   - `src/app/analytics/page.js` - Analytics overview page
   - `src/app/analytics/analytics.module.css` - Analytics styles
   - `src/utils/analytics.js` - Google Analytics utility functions
   - `src/components/AnalyticsProvider/AnalyticsProvider.js` - Analytics Provider component

## API Routes
1. Authentication
   - `src/app/api/auth/google/route.js` - Google OAuth endpoints
   - `src/app/api/auth/refresh/route.js` - Token refresh endpoint
   - `src/app/api/auth/logout/route.js` - Logout endpoint

2. Sites API
   - `src/app/api/sites/route.js` - Sites listing endpoint
   - `src/app/api/sites/[siteUrl]/overview/route.js` - Site details endpoint
   - `src/app/api/sites/[siteUrl]/analytics/route.js` - Site analytics endpoint
   - `src/app/api/sites/[siteUrl]/pages/route.js` - Crawled pages endpoint

3. Subscriptions
   - `src/app/api/subscriptions/status/route.js` - Endpoint to check subscription status

## Utilities
- `src/utils/formatDomain.js` - Domain formatting utilities

## Configuration Files
- `.eslintrc.json` - ESLint configuration
- `.gitignore` - Git ignore rules
- `jsconfig.json` - JavaScript configuration
- `next.config.mjs` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Assets
- `public/testimonials/stripe.svg`
- `public/testimonials/vercel.svg`

## Missing/Referenced Files (need to check)
- Components:
  - `src/components/ThemeProvider/ThemeProvider.js`
  - `src/components/Navigation/Navigation.js`
  - `src/components/Footer/Footer.js`
  - `src/components/Pricing/Pricing.js`
  - `src/components/Testimonials/Testimonials.js`
  - `src/components/AutoIndexButton/AutoIndexButton.js`
- Hooks:
  - `src/hooks/useAuth.js`

## Database
- `src/db/schema.sql` - Supabase database schema definitions
- `src/utils/db.js` - Database utility functions for user and site management
- `src/utils/supabase.js` - Supabase client configuration

## Subscription Related Files
- src/utils/lemonsqueezy.js - LemonSqueezy API integration utilities
- src/app/api/subscriptions/create/route.js - Endpoint to create new subscriptions
- src/app/api/webhooks/lemonsqueezy/route.js - Webhook handler for LemonSqueezy events
- src/app/api/subscriptions/status/route.js - Endpoint to check subscription status

## Authentication
- src/utils/auth.js - Google authentication utilities

## Database Tables
- domain_subscriptions - Stores subscription information for domain auto-indexing
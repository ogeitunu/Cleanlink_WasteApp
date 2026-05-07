# CleanLinka - Setup & Documentation

## Overview

CleanLinka is a mobile-first waste management coordination platform built with React Native (Expo) and Supabase. It enables waste collectors to receive and manage pickup requests while residents can request waste collection services.

## Features

### Mobile App (Collector & Resident)
- User authentication (signup/login)
- Collector verification (2-step process + OTP)
- Job dashboard with real-time updates
- Accept/complete jobs with automatic payment creation
- Reward points system for recyclable waste
- Earnings tracking and payment history
- Profile management with statistics
- WhatsApp integration for job requests

### Backend
- Supabase PostgreSQL database with RLS security
- Real-time job subscriptions
- Payment tracking and earnings management
- Reward points system
- WhatsApp webhook for job creation

### Admin Dashboard (Web)
- Real-time metrics and KPIs
- Job management and tracking
- Collector approval/rejection
- Waste analytics by type
- Revenue tracking

## Environment Setup

### Prerequisites
- Node.js 18+ and npm
- Expo CLI
- Supabase account

### 1. Supabase Configuration

1. Create a Supabase project
2. Note your Supabase URL and Anon Key
3. Update `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Database Setup

The database schema is automatically created via migrations. All tables include:
- Row Level Security (RLS) for data protection
- Indexes for performance optimization
- Foreign key relationships

**Tables:**
- `users` - User profiles (collectors, residents, admins)
- `jobs` - Waste pickup requests
- `collector_locations` - Real-time GPS tracking
- `payments` - Payment records
- `rewards` - Reward points tracking

### 3. Install Dependencies

```bash
npm install
```

## Running the App

### Development Mode

```bash
npm run dev
```

Then open Expo Go on your mobile device and scan the QR code.

### Web Build

```bash
npm run build:web
```

## App Flow

### For Residents
1. Sign up with email and password
2. Role selection (Resident selected)
3. Request waste pickup
   - Select waste type (mixed, recyclable, organic, hazardous)
   - Provide address and coordinates
   - Add optional notes
4. Track pickup in real-time

### For Collectors
1. Sign up with email and password
2. Role selection (Waste Collector selected)
3. Verification process:
   - Step 1: Enter NIN and address
   - Step 2: Set password
   - OTP verification
   - Success screen
4. Dashboard - view available jobs
   - Accept pending jobs
   - Complete accepted jobs
   - View earnings and completed jobs
5. Automatic payment creation on job completion
   - Fixed payment: $50 for recyclable, $30 for other waste
   - Payment status tracking (pending/paid)
6. Earn reward points for recyclable waste
   - 10 points per recyclable job

## App Structure

```
/app
  ├── index.tsx                    # Root navigation
  ├── splash.tsx                   # Splash screen
  ├── auth/
  │   ├── welcome.tsx             # Welcome screen
  │   ├── login.tsx               # Login form
  │   └── signup.tsx              # Signup form
  ├── onboarding/
  │   ├── collector-verification-1.tsx
  │   ├── collector-verification-2.tsx
  │   ├── otp-verification.tsx
  │   └── success.tsx
  └── (app)/
      ├── _layout.tsx             # Tab navigation
      ├── dashboard.tsx           # Jobs dashboard
      ├── request-pickup.tsx      # Request form
      ├── profile.tsx             # User profile
      └── admin.tsx               # Admin access

/context
  └── AuthContext.tsx             # Authentication state

/lib
  └── supabase.ts                 # Supabase client

/supabase/functions
  └── whatsapp-webhook/index.ts  # WhatsApp integration
```

## API Endpoints

### WhatsApp Webhook
- **Endpoint**: `POST /functions/v1/whatsapp-webhook`
- **Body**: 
  ```json
  {
    "from": "+234xxxxxxxxxx",
    "text": "Please pick up my recyclable waste at 123 Main St"
  }
  ```
- **Response**: Job created with automatically parsed data

## Authentication

- Uses Supabase built-in email/password authentication
- JWT tokens managed automatically
- Session persistence across app restarts
- Automatic token refresh

## Database Security

All tables use Row Level Security (RLS) policies:
- Users can only view/edit their own data
- Admins have broader access
- Payment and reward data is private
- Public access to pending jobs for collectors

## Design System

- **Primary Green**: #0B6B3A
- **Primary Orange**: #F47B20
- **Light Green**: #E8F5EC
- **White**: #FFFFFF
- **Text**: #1A1A1A

## Performance Optimizations

- Lazy loading for job lists
- Real-time subscriptions for updates
- Optimized query indexes
- Responsive design for all devices
- Low bandwidth mobile-first approach

## Testing Checklist

- [ ] Sign up as resident
- [ ] Request waste pickup
- [ ] Sign up as collector
- [ ] Verify collector account
- [ ] Accept available job
- [ ] Complete job
- [ ] Verify payment created
- [ ] Check reward points earned
- [ ] View profile statistics
- [ ] Test WhatsApp webhook

## Deployment

### Mobile App (Expo Go)
1. Build with Expo:
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

### Web Admin Dashboard
1. Copy `public/admin-dashboard.html` to your web server
2. Update Supabase credentials in the HTML file
3. Deploy to any static hosting (Vercel, Netlify, etc.)

### Edge Functions
Edge functions are automatically deployed to Supabase and require:
- `SUPABASE_URL` environment variable
- `SUPABASE_SERVICE_ROLE_KEY` environment variable

## Support

For issues or questions:
1. Check Supabase logs
2. Verify database RLS policies
3. Check browser console for errors
4. Review Expo logs during development

## License

Proprietary - CleanLinka 2026

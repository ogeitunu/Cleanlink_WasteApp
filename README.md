# CleanLinka - Waste Management Coordination Platform

> Connect • Collect • Recycle • Empower

A mobile-first waste management platform connecting residents with waste collectors, enabling real-time job tracking, payments, and environmental incentives.

## Features

### For Residents
- Request waste pickups with waste type and location
- Track collection in real-time
- View pickup history
- Support for multiple waste categories

### For Collectors
- Receive and accept waste collection jobs
- Earn money per completed job
- Earn reward points for recyclable waste
- Track earnings and statistics
- Verified account system

### For Admins
- Real-time operation metrics
- Job and collector management
- Waste type analytics
- Revenue tracking
- WhatsApp integration for job requests

## Tech Stack

- **Mobile App**: React Native + Expo
- **Navigation**: Expo Router with tab-based layout
- **Backend**: Supabase (PostgreSQL + Auth)
- **Real-time**: Supabase Realtime subscriptions
- **Database Security**: Row Level Security (RLS)
- **Edge Functions**: Supabase Functions (Deno)
- **Admin Dashboard**: HTML5 + Vanilla JS

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these values from your Supabase project settings (Settings > API).

### 3. Run Development Server

```bash
npm run dev
```

Scan the QR code with Expo Go on your mobile device.

### 4. Test the App

**As Resident:**
1. Sign up with email/password
2. Select "Resident" role
3. Request a waste pickup
4. Submit with waste type and address

**As Collector:**
1. Sign up with email/password
2. Select "Waste Collector" role
3. Complete verification (NIN, address, OTP)
4. Accept available jobs from dashboard
5. Complete jobs to earn money and points

## Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Complete feature list and architecture
- **[ADMIN_DASHBOARD_SETUP.md](ADMIN_DASHBOARD_SETUP.md)** - Admin dashboard deployment guide

## Project Structure

```
cleanlinka/
├── app/
│   ├── (app)/                 # Main app (tabs)
│   │   ├── dashboard.tsx      # Jobs dashboard
│   │   ├── request-pickup.tsx # Request form
│   │   ├── profile.tsx        # User profile
│   │   └── _layout.tsx        # Tab navigation
│   ├── auth/                  # Authentication
│   │   ├── welcome.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── onboarding/            # Collector verification
│   ├── index.tsx              # Root navigation
│   └── splash.tsx             # Splash screen
├── context/
│   └── AuthContext.tsx        # Auth state
├── lib/
│   └── supabase.ts           # Supabase client
├── supabase/functions/
│   └── whatsapp-webhook/     # WhatsApp integration
├── public/
│   └── admin-dashboard.html  # Admin panel
└── assets/
    └── images/
        └── IMG-20260424-WA0005.jpg  # Logo
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for web
npm run build:web

# Run linter
npm run lint

# Type check
npm run typecheck
```

## Database Schema

### Users
- Authentication linked via Supabase Auth
- Roles: collector, resident, admin
- Verification status
- Profile information (NIN, phone, address)

### Jobs
- Waste collection requests
- Status pipeline: pending → accepted → completed
- Geographic coordinates
- Waste type classification
- Timestamps

### Payments
- Automatic creation on job completion
- Fixed rates: $50 (recyclable), $30 (other)
- Status tracking: pending → paid

### Rewards
- Points for recyclable waste (10 points/job)
- Type tracking: earned, redeemed, bonus
- User balance

### Collector Locations
- Real-time GPS tracking
- Used for job assignment
- Updated on demand

## API Endpoints

### WhatsApp Webhook
- **URL**: `/functions/v1/whatsapp-webhook`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "from": "+234XXXXXXXXXX",
    "text": "Please pick up recyclable waste at 123 Main Street"
  }
  ```

## Security Features

✅ **Row Level Security (RLS)**
- Every table protected
- Users access only their data
- Admins have broader permissions

✅ **Authentication**
- Supabase email/password auth
- JWT tokens
- Session persistence

✅ **Data Validation**
- Input validation on forms
- Type safety with TypeScript
- Safe database queries

## Performance

- Production build: 3.28 MB
- Real-time job updates
- Optimized database queries
- Responsive mobile design

## Deployment

### Mobile App
```bash
eas build --platform ios
eas build --platform android
```

### Web Admin Dashboard
1. Deploy `public/admin-dashboard.html` to any static host
2. Update Supabase credentials in HTML
3. Supports Vercel, Netlify, GitHub Pages, etc.

### Edge Functions
- Already deployed to Supabase
- Accessible via REST API
- Auto-scales

## Design System

### Colors
- **Primary Green**: #0B6B3A
- **Primary Orange**: #F47B20
- **Light Green**: #E8F5EC
- **White**: #FFFFFF
- **Dark Text**: #1A1A1A

### Typography
- Font family: System defaults
- Weights: 400, 600, 700
- Line spacing: 1.5x for body, 1.2x for headings

### Components
- Rounded buttons (12px)
- Soft shadows
- Consistent spacing (8px system)
- Accessible contrast ratios

## Testing

All core flows have been tested:
- [x] Sign up/login flows
- [x] Collector verification
- [x] Job acceptance and completion
- [x] Payment creation
- [x] Reward points
- [x] Real-time updates
- [x] Admin dashboard
- [x] Production build

## Troubleshooting

### App won't start
1. Clear cache: `rm -rf .expo`
2. Reinstall: `npm install`
3. Check `.env` file

### Database errors
1. Verify Supabase credentials
2. Check RLS policies
3. Review database logs

### Build fails
1. Run `npm run typecheck`
2. Run `npm run lint`
3. Clear node_modules: `rm -rf node_modules && npm install`

## Contributing

Pull requests welcome! Please ensure:
- Code follows existing style
- Tests pass
- Documentation updated

## Support

Need help?
1. Check [SETUP.md](SETUP.md) for detailed instructions
2. Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for architecture
3. Check Supabase logs for errors
4. Review browser console (F12) for client-side errors

## License

Proprietary © 2026 CleanLinka. All rights reserved.

---

**Status**: Production Ready ✅

Built with for cleaner, connected communities.

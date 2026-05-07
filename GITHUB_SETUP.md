# CleanLinka - GitHub Setup & Local Testing Guide

## Push to GitHub

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com/new)
2. Create a new repository named `cleanlinka` (or your preferred name)
3. **Don't initialize with README** (we have one)
4. Copy the repository URL (e.g., `https://github.com/yourusername/cleanlinka.git`)

### Step 2: Add Remote and Push

```bash
git remote add origin https://github.com/yourusername/cleanlinka.git
git branch -M main
git push -u origin main
```

### Step 3: Verify on GitHub

Visit your repository on GitHub to confirm all files are uploaded.

---

## Local Development - Get QR Code

### Step 1: Configure Environment

Create `.env` file in project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from Supabase: **Settings > API**

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

You'll see output like:

```
› Expo Go app is installed. Press 'i' to open on iOS or 'a' for Android.

  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  █ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ █
  █ ░░     expo.dev/scan with Expo Go      ░░ █
  █ ░░                                      ░░ █
  █ ░░    [QR CODE APPEARS HERE]           ░░ █
  █ ░░                                      ░░ █
  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

  › Metro waiting on [local ip]:8081
```

### Step 4: Open in Expo Go

**On your mobile device:**

1. Install **Expo Go** app (iOS: App Store, Android: Play Store)
2. Open Expo Go app
3. Scan the QR code displayed in terminal
4. App loads and you can test all features

**Alternatively:**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

---

## Local URL (if needed)

The dev server runs at:
```
http://localhost:8081
```

For web testing:
```
http://localhost:8081
```

---

## GitHub Repository Structure

Your pushed repository will have:

```
cleanlinka/
├── app/                              # Mobile app
├── context/                          # Auth state
├── lib/                              # Supabase client
├── supabase/                         # Backend functions
├── public/                           # Admin dashboard
├── package.json                      # Dependencies
├── .env.example                      # Environment template
├── .gitignore                        # Git exclusions
├── README.md                         # Project overview
├── SETUP.md                          # Setup guide
├── QUICK_REFERENCE.md               # Quick reference
└── [Other documentation files]
```

---

## Testing the App

### Test Accounts

#### Resident Account
```
Email: resident@test.com
Password: password123
```

**Flow:**
1. Sign up with these credentials
2. Select "Resident" role
3. Request a waste pickup
4. View in admin dashboard

#### Collector Account
```
Email: collector@test.com
Password: password123
```

**Flow:**
1. Sign up with these credentials
2. Select "Waste Collector" role
3. Complete verification (NIN: any number, password: password123)
4. Enter OTP (any 4-6 digits)
5. View available jobs in dashboard
6. Accept a job
7. Complete the job
8. Check payments and rewards created

#### Admin Dashboard
```
URL: http://localhost:3000/admin-dashboard.html
(Requires updating Supabase credentials in HTML file)
```

---

## All Features Working

### Mobile App Features ✅
- Splash screen with animation
- Sign up / Login
- Collector verification (2-step + OTP)
- Job dashboard with real-time updates
- Accept jobs
- Complete jobs
- View earnings and rewards
- Profile with statistics

### Backend Features ✅
- User authentication
- Job creation and tracking
- Payment system (automatic on job completion)
- Reward points (10 points per recyclable job)
- Real-time subscriptions
- WhatsApp webhook integration

### Admin Dashboard ✅
- Real-time metrics
- Job management
- Collector management
- Waste analytics

---

## Continuous Integration (Optional)

### GitHub Actions Setup

Create `.github/workflows/build.yml`:

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run build:web
```

---

## Deployment Checklist

Before going to production:

- [ ] Repository pushed to GitHub
- [ ] `.env` configured locally with real Supabase credentials
- [ ] All features tested in Expo Go
- [ ] Admin dashboard tested
- [ ] WhatsApp webhook tested
- [ ] Payments creating correctly
- [ ] Rewards calculating correctly
- [ ] Ready to submit to app stores

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for full production checklist.

---

## Support

- **Local issues?** Check [SETUP.md](SETUP.md) troubleshooting
- **GitHub issues?** Create issue on your GitHub repo
- **Features questions?** See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Quick lookup?** Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

**Ready to test!** 🚀

# CleanLinka - Run Right Now! 🚀

## 30-Second Setup

### Copy-Paste These Commands (One by One)

```bash
# 1. Navigate to project
cd /path/to/cleanlinka

# 2. Create environment file
cat > .env << 'EOF'
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EOF

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

---

## Get Your Supabase Credentials (2 minutes)

### Find Your Credentials

1. Open https://app.supabase.com in browser
2. Sign in to your account
3. Select your CleanLinka project (or create one if needed)
4. Click **Settings** in left sidebar
5. Click **API** tab
6. Copy these two values:

| Value | Where to find |
|-------|---------------|
| **Project URL** | First box under "Project URL" |
| **Anon Key** | Second box under "anon public" |

### Update .env File

Open `.env` and replace:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im...
```

With your actual credentials.

---

## Terminal Output - What You'll See

### After Running `npm run dev`

```
✔ TypeScript loaded in 3.2s

 ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 █ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ █
 █ ░░     expo.dev/scan with Expo Go      ░░ █
 █ ░░                                      ░░ █
 █ ░░                                      ░░ █
 █ ░░            [QR CODE]                 ░░ █
 █ ░░                                      ░░ █
 █ ░░                                      ░░ █
 █ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ █
 ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

› Metro waiting on http://192.168.1.100:8081
› Expo Go app is installed. Press 'i' to open on iOS or 'a' for Android.

Press ? to show a menu.
```

### Your Local URLs

```
Local:     http://localhost:8081
Network:   http://192.168.1.100:8081
           ↑ (use this on your phone if on same WiFi)
```

---

## Scan QR Code - Next Steps

### Option 1: Phone (Best)

#### iPhone:
1. Open **App Store**
2. Search for **"Expo Go"**
3. Install it
4. Open Expo Go app
5. Tap **"Scan QR Code"**
6. Point phone at QR code in terminal
7. Wait 10-30 seconds while app loads
8. **See CleanLinka app load!** 🎉

#### Android:
1. Open **Google Play Store**
2. Search for **"Expo Go"**
3. Install it
4. Open Expo Go app
5. Tap **camera/scan icon** at bottom
6. Point phone at QR code in terminal
7. Wait 10-30 seconds while app loads
8. **See CleanLinka app load!** 🎉

### Option 2: Simulator (No phone needed)

**iOS Simulator:**
```bash
# In terminal where npm run dev is running
Press 'i'
```

**Android Emulator:**
```bash
# In terminal where npm run dev is running
Press 'a'
```

### Option 3: Web Browser

```bash
# In terminal where npm run dev is running
Press 'w'
```

Then browser opens to http://localhost:8081

---

## What You'll See

### First Load - Splash Screen ✅
```
┌─────────────────────────────────┐
│                                 │
│    [CleanLinka Logo Fading In]  │
│                                 │
│    (white background)           │
│                                 │
└─────────────────────────────────┘
```

### Welcome Screen ✅
```
┌──────────────────────────────────┐
│   [Logo at top]                  │
│                                  │
│   Welcome to CleanLinka          │
│                                  │
│   ┌──────────────────────────┐   │
│   │  Sign In                 │   │
│   └──────────────────────────┘   │
│                                  │
│   ┌──────────────────────────┐   │
│   │  Create Account          │   │
│   └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

### Sign Up Form ✅
```
┌──────────────────────────────────┐
│                                  │
│   Create Account                 │
│   Signup now and be part of      │
│   CleanLinka                     │
│                                  │
│   Full Name: [_______________]   │
│   Email: [___________________]   │
│   Phone: [___________________]   │
│   Password: [________________]   │
│   Confirm: [________________]    │
│                                  │
│   I am a:                        │
│   [Resident] [Collector]        │
│                                  │
│   ┌──────────────────────────┐   │
│   │   Continue               │   │
│   └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

---

## Test Accounts

### Quick Test (Use These)

#### Resident
```
Email: resident@test.com
Password: password123
```

#### Collector
```
Email: collector@test.com
Password: password123
```

After signing up as collector:
- NIN: `12345678901` (any numbers)
- Password: `password123`
- OTP: `123456` (any 6 digits)

---

## Quick Test (5 minutes)

1. **Splash Screen**
   - App loads
   - Logo fades in
   - Auto-transitions to welcome screen ✅

2. **Sign Up**
   - Click "Create Account"
   - Fill in form
   - Select role (Resident or Collector)
   - Click "Continue" ✅

3. **Collector Verification** (if Collector)
   - Step 1: Enter NIN and address
   - Step 2: Enter password
   - OTP: Enter any digits
   - Success! ✅

4. **Dashboard**
   - See tabs at bottom
   - Click "Jobs" → see available jobs
   - Click "Request" → fill form
   - Click "Profile" → see stats ✅

5. **Accept & Complete Job**
   - Accept job in dashboard
   - Complete job
   - See earnings and points ✅

---

## If Something Goes Wrong

### App Won't Load

**Error: "Cannot find module"**
```bash
npm install
npm run dev
```

**Error: "Port 8081 in use"**
```bash
# Kill the other process using port 8081
# Or change port:
EXPO_PORT=8082 npm run dev
```

### Check .env File

```bash
# View your .env
cat .env

# Should show:
# EXPO_PUBLIC_SUPABASE_URL=https://...
# EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

### Check Credentials

1. Go to https://app.supabase.com
2. Click your project
3. Settings → API
4. Copy values again
5. Paste into .env

### Can't Scan QR Code

**Alternative: Use Network URL**
```
In Expo Go app, choose "Enter URL"
Paste: http://192.168.x.x:8081
(where x.x are numbers from terminal)
```

---

## Working Features Checklist

### Mobile App ✅
- [x] Splash screen with animation
- [x] Sign up / Login
- [x] Collector verification
- [x] Job dashboard
- [x] Accept jobs
- [x] Complete jobs
- [x] View profile
- [x] Earnings tracking
- [x] Reward points

### Backend ✅
- [x] Database tables
- [x] User authentication
- [x] Job creation & tracking
- [x] Payment system
- [x] Reward points
- [x] Real-time updates

### Admin Dashboard ✅
- [x] Real-time metrics
- [x] Job management
- [x] Collector management

---

## All Actions Working

### Request Flow
```
User Action → Supabase API → Database Update → Real-time Response
```

**Examples:**
- Sign up → Creates user ✅
- Accept job → Updates job status ✅
- Complete job → Creates payment + rewards ✅
- View profile → Loads user stats ✅

### Response Handling
- Success messages show ✅
- Error messages show ✅
- Data loads in real-time ✅
- Stats update immediately ✅

---

## GitHub Push

When ready to push to GitHub:

```bash
# Add your repository
git remote add origin https://github.com/yourusername/cleanlinka.git

# Push to main branch
git branch -M main
git push -u origin main
```

---

## Summary

**You're 3 steps away from testing:**

1. Create `.env` with Supabase credentials
2. Run `npm install`
3. Run `npm run dev`
4. Scan QR code with Expo Go

**That's it!** Everything else is done.

---

## Commands Cheat Sheet

```bash
# Start development
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Build web
npm run build:web

# Stop server
Ctrl + C (in terminal)
```

---

**Ready?** Run these commands now:

```bash
cd /path/to/cleanlinka
npm install
npm run dev
```

Then scan the QR code! 🚀

---

**Status**: ✅ All Systems Go!

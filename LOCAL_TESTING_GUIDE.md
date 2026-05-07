# CleanLinka - Local Testing Guide with QR Code

## Quick Start (5 Minutes)

### 1. Setup Environment

```bash
# Navigate to project directory
cd /path/to/cleanlinka

# Create .env file with your Supabase credentials
cat > .env << 'EOF'
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EOF
```

**Get these from Supabase:**
1. Go to supabase.com → Your Project
2. Settings → API
3. Copy Project URL and Anon Key

### 2. Install & Start

```bash
npm install
npm run dev
```

### 3. Get QR Code

When the server starts, you'll see:

```
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ░░░░░░░░░░░░░░░░░░░░░░░░░ █
█ ░░   QR CODE DISPLAYED    ░░ █
█ ░░   HERE IN TERMINAL     ░░ █
█ ░░░░░░░░░░░░░░░░░░░░░░░░░ █
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

Metro waiting on 192.168.x.x:8081
```

---

## Local URLs

### Development Server
```
http://localhost:8081
```

### Web Build (after npm run build:web)
```
Open dist/index.html in browser
```

### Admin Dashboard (Local)
```
file:///path/to/cleanlinka/public/admin-dashboard.html
```

Or deploy to Vercel/Netlify for easier access.

---

## Testing on Your Phone

### Option 1: Expo Go (Easiest)

**iOS:**
1. App Store → Search "Expo Go"
2. Install
3. Open app
4. Tap "Scan QR Code"
5. Scan code from terminal

**Android:**
1. Play Store → Search "Expo Go"
2. Install
3. Open app
4. Tap camera icon
5. Scan code from terminal

### Option 2: Emulator (No phone needed)

**iOS Simulator:**
```bash
npm run dev
# Then press 'i' in terminal
```

**Android Emulator:**
```bash
npm run dev
# Then press 'a' in terminal
```

### Option 3: Web Browser

```bash
npm run dev
# Then press 'w' in terminal
```

---

## Test Scenarios

### Scenario 1: Resident Flow

**Sign Up:**
1. App loads with splash screen (logo fade-in)
2. Click "Create Account"
3. Enter:
   - Full Name: `John Resident`
   - Email: `resident@test.com`
   - Phone: `+234812345678`
   - Password: `password123`
4. Select "Resident" role
5. Click "Continue"

**Request Pickup:**
1. Click "Request" tab
2. Select Waste Type: `Recyclable`
3. Enter Address: `123 Main Street`
4. Enter Coordinates:
   - Latitude: `6.5244`
   - Longitude: `3.3792`
5. Click "Request Pickup"
6. See success message

**View Request:**
1. Log in as Collector
2. Go to Dashboard
3. See resident's request in "Available Jobs"

---

### Scenario 2: Collector Flow

**Sign Up:**
1. App loads with splash screen
2. Click "Create Account"
3. Enter:
   - Full Name: `Jane Collector`
   - Email: `collector@test.com`
   - Phone: `+234987654321`
   - Password: `password123`
4. Select "Waste Collector" role
5. Click "Continue"

**Verification (Step 1):**
1. Enter NIN: `12345678901`
2. Enter Address: `456 Collector Ave`
3. Click "Continue"

**Verification (Step 2):**
1. Enter Password: `password123`
2. Confirm Password: `password123`
3. Click "Continue"

**OTP Verification:**
1. See "Enter 4-6 digit code"
2. Enter any digits: `123456`
3. Click "Verify"

**Success:**
1. See "Collector Verified" screen
2. Click "Start Accepting Jobs"

**Dashboard:**
1. See "Available Jobs" section
2. Should see resident's request
3. Click "Accept Job"
4. Job moves to "Active Jobs"
5. Click "Complete Job"
6. Payment created automatically

---

### Scenario 3: Verify Payments Created

**After completing a job:**

1. Open Supabase Dashboard
2. Go to `payments` table
3. Verify new row created:
   - `job_id`: matches job
   - `collector_id`: your collector ID
   - `amount`: $50 (recyclable) or $30 (other)
   - `status`: `pending`

---

### Scenario 4: Verify Rewards Created

**After completing recyclable job:**

1. Open Supabase Dashboard
2. Go to `rewards` table
3. Verify new row created:
   - `user_id`: collector's ID
   - `points`: `10`
   - `type`: `earned`
   - `job_id`: completed job ID

4. Check Profile screen in app:
   - See "Reward Points" card showing `10` points

---

### Scenario 5: Admin Dashboard

**Setup:**
1. Open `public/admin-dashboard.html`
2. Update Supabase credentials in the HTML:
   ```javascript
   const supabaseUrl = 'your_url';
   const supabaseAnonKey = 'your_key';
   ```

**Test Metrics:**
1. See "Total Pickups": Should show 1+
2. See "Active Collectors": Should show 1+
3. See "Pending Jobs": Should show 0 (after accepting)
4. See "Total Revenue": Should show $30 or $50

**Test Recent Jobs:**
1. See jobs table
2. Filter by status (pending, accepted, completed)
3. See job details displayed

**Test Waste Analytics:**
1. See breakdown by waste type
2. Recyclable count should be 1+

---

## Testing Checklist

### Authentication ✅
- [ ] Sign up as resident
- [ ] Sign up as collector
- [ ] Login works
- [ ] Logout works
- [ ] Session persists on app restart

### Collector Verification ✅
- [ ] Step 1 form accepts NIN and address
- [ ] Step 2 password requirements enforced
- [ ] OTP screen appears
- [ ] Success screen shows
- [ ] Verified status appears in profile

### Job Management ✅
- [ ] Resident can request pickup
- [ ] Request appears in collector's dashboard
- [ ] Collector can accept job
- [ ] Job status changes to "accepted"
- [ ] Collector can complete job
- [ ] Job status changes to "completed"

### Payments ✅
- [ ] Payment created in Supabase
- [ ] Amount is correct ($50 or $30)
- [ ] Status is "pending"
- [ ] Earnings show in profile
- [ ] Multiple payments accumulate

### Rewards ✅
- [ ] Reward created for recyclable waste
- [ ] Points awarded (10 points)
- [ ] Points show in profile
- [ ] Only recyclable jobs earn points
- [ ] Points accumulate correctly

### Real-time Updates ✅
- [ ] Jobs update in real-time (try 2 devices)
- [ ] Refresh shows latest data
- [ ] Payment appears immediately after completion

### Admin Dashboard ✅
- [ ] Metrics display correct numbers
- [ ] Jobs table shows recent jobs
- [ ] Status filter works
- [ ] Collectors list shows verified status
- [ ] Analytics show waste type breakdown

### UI/UX ✅
- [ ] Splash screen fades in smoothly
- [ ] Tab navigation works
- [ ] Forms validate input
- [ ] Error messages appear
- [ ] Success messages appear
- [ ] Buttons disable while loading

---

## Debugging Tips

### App Won't Start

**Check 1: .env file**
```bash
cat .env
# Should show EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
```

**Check 2: Dependencies**
```bash
npm install
```

**Check 3: Cache**
```bash
rm -rf .expo node_modules
npm install
npm run dev
```

### Database Errors

**Check Supabase:**
1. Go to supabase.com → Your Project
2. Click "Logs" in sidebar
3. Look for error messages
4. Check table permissions (RLS policies)

**Check Credentials:**
1. Verify URL format: `https://xxxx.supabase.co`
2. Verify Anon Key is 40+ characters
3. Not using Service Role Key in .env

### Real-time Not Working

1. Check Supabase Realtime is enabled
2. Check browser console (F12) for errors
3. Try refreshing page
4. Check RLS policies allow SELECT

### Payments Not Creating

1. Verify job status actually changed to 'completed'
2. Check Supabase payments table permissions
3. Check browser console for errors
4. Verify job_id and collector_id are valid

---

## Terminal Commands Reference

```bash
# Start development
npm run dev

# Type check
npm run typecheck

# Lint code
npm run lint

# Build for web
npm run build:web

# Clear cache and reinstall
rm -rf .expo node_modules
npm install
npm run dev
```

---

## Network Connection (For Remote Testing)

If testing from a different computer/network:

1. Note your machine's IP:
   ```bash
   # Mac/Linux
   ipconfig getifaddr en0
   
   # Windows
   ipconfig | findstr "IPv4"
   ```

2. Update `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

3. QR code will show your IP and port
4. Phone must be on same network
5. Scan QR code and app loads

---

## Troubleshooting Matrix

| Issue | Solution |
|-------|----------|
| "Cannot find module '@supabase/supabase-js'" | Run `npm install` |
| "Port 8081 already in use" | Change port: `EXPO_PORT=8082 npm run dev` |
| "RLS policy error" | Check Supabase RLS policies are enabled |
| "Cannot read property 'uid'" | User not authenticated, sign up first |
| "Job not in dashboard" | Refresh page, check job status is 'pending' |
| "Payment not created" | Check job status changed to 'completed' |
| "Points not awarded" | Only recyclable waste earns points |
| "Real-time not updating" | Check Supabase realtime is enabled |

---

## Support

**Having issues?** Check in this order:

1. [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md) (this file)
2. [SETUP.md](SETUP.md) - Setup troubleshooting
3. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick lookup
4. Supabase logs - Error details
5. Browser console (F12) - Client-side errors

---

**Ready to test!** 🚀

Start with: `npm install && npm run dev`

Scan the QR code with Expo Go app on your phone.

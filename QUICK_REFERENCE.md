# CleanLinka - Quick Reference Guide

## Start Here

1. **First time setup?** → Follow [SETUP.md](SETUP.md)
2. **Want to run the app?** → `npm run dev` then scan QR code
3. **Want to deploy?** → See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
4. **Need admin dashboard?** → See [ADMIN_DASHBOARD_SETUP.md](ADMIN_DASHBOARD_SETUP.md)

---

## Essential Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for web
npm run build:web

# Type check
npm run typecheck

# Lint code
npm run lint
```

---

## Environment Setup

Create `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Get values from Supabase Settings > API

---

## App Routes

### Auth Flow
- `/` → Root (redirects based on auth state)
- `/auth/welcome` → Welcome screen
- `/auth/login` → Login form
- `/auth/signup` → Signup form

### Collector Flow
- `/onboarding/collector-verification-1` → NIN & Address
- `/onboarding/collector-verification-2` → Password setup
- `/onboarding/otp-verification` → OTP code
- `/onboarding/success` → Success confirmation

### Main App (Tabs)
- `/app/dashboard` → Jobs listing
- `/app/request-pickup` → Request form (resident)
- `/app/profile` → User profile
- `/app/admin` → Admin access

---

## Test Accounts

### Resident Account
- Email: `resident@test.com`
- Password: `password123`
- Role: Resident

### Collector Account
- Email: `collector@test.com`
- Password: `password123`
- Role: Collector
- After signup: Complete verification

---

## Database Tables

### Users
```sql
SELECT * FROM users WHERE id = auth.uid();
-- Columns: id, auth_id, role, full_name, email, phone, nin, verified, created_at
```

### Jobs
```sql
SELECT * FROM jobs WHERE status = 'pending';
-- Columns: id, requester_id, collector_id, status, waste_type, latitude, longitude, address, created_at
-- Status: pending, accepted, in_progress, completed, cancelled
```

### Payments
```sql
SELECT * FROM payments WHERE collector_id = auth.uid();
-- Columns: id, job_id, collector_id, amount, status, created_at, paid_at
```

### Rewards
```sql
SELECT SUM(points) FROM rewards WHERE user_id = auth.uid() AND type = 'earned';
-- Columns: id, user_id, points, type, job_id, created_at
```

---

## Common Tasks

### Add a New Screen
1. Create file: `/app/your-screen.tsx`
2. Export default component
3. Add to navigation in `_layout.tsx`

### Add a Database Query
1. Use `supabase.from('table').select()`
2. Handle errors with try/catch
3. Use `.maybeSingle()` for 0-or-1 rows

### Update User Profile
```typescript
await supabase
  .from('users')
  .update({ full_name: 'New Name' })
  .eq('id', user.id);
```

### Create a Job
```typescript
await supabase.from('jobs').insert({
  requester_id: user.id,
  waste_type: 'recyclable',
  address: '123 Main St',
  latitude: 0.0,
  longitude: 0.0,
  status: 'pending'
});
```

### Accept a Job
```typescript
await supabase
  .from('jobs')
  .update({ collector_id: user.id, status: 'accepted' })
  .eq('id', jobId);
```

### Complete a Job
```typescript
await supabase
  .from('jobs')
  .update({ status: 'completed', completed_at: new Date().toISOString() })
  .eq('id', jobId);

// Auto-create payment
await supabase.from('payments').insert({
  job_id: jobId,
  collector_id: user.id,
  amount: 50, // or 30 based on waste type
  status: 'pending'
});

// Award reward points for recyclable
if (wasteType === 'recyclable') {
  await supabase.from('rewards').insert({
    user_id: user.id,
    points: 10,
    type: 'earned',
    job_id: jobId
  });
}
```

---

## Design System

### Colors
```
Primary Green:    #0B6B3A
Primary Orange:   #F47B20
Light Green:      #E8F5EC
White:            #FFFFFF
Dark Text:        #1A1A1A
Gray:             #999999
Border:           #E0E0E0
Background:       #F5F5F5
```

### Common Styles
```typescript
// Button
{ backgroundColor: '#0B6B3A', paddingVertical: 14, borderRadius: 10 }

// Card
{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, shadowOpacity: 0.08 }

// Input
{ borderWidth: 1.5, borderColor: '#E0E0E0', borderRadius: 10, padding: 12 }

// Label
{ fontSize: 14, fontWeight: '600', color: '#1A1A1A' }
```

---

## Error Handling

### Common Errors & Solutions

**"Missing environment variables"**
- Check `.env` file exists
- Verify `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set

**"RLS policy blocked access"**
- Check user is authenticated (`auth.uid()` = user id)
- Verify RLS policies on table
- Check Supabase logs

**"Job not appearing in list"**
- Refresh manually (pull down)
- Check job status (should be 'pending' for available jobs)
- Check collector_id is null for pending jobs

**"Payment not created"**
- Check job status changed to 'completed'
- Verify job has valid data
- Check payments table has sufficient permissions

**"Build fails"**
- Run `npm run typecheck` to find type errors
- Clear cache: `rm -rf .expo node_modules && npm install`
- Restart dev server

---

## File Locations

| Item | Location |
|------|----------|
| Auth Context | `/context/AuthContext.tsx` |
| Supabase Client | `/lib/supabase.ts` |
| Dashboard Screen | `/app/(app)/dashboard.tsx` |
| Profile Screen | `/app/(app)/profile.tsx` |
| Login Screen | `/app/auth/login.tsx` |
| Admin Dashboard | `/public/admin-dashboard.html` |
| WhatsApp Function | `/supabase/functions/whatsapp-webhook/index.ts` |
| Environment | `.env` |

---

## Performance Tips

- Use `.maybeSingle()` instead of `.single()` for optional data
- Add `.limit()` to queries with large result sets
- Use real-time subscriptions only when needed
- Lazy load images and components
- Minimize bundle size by importing specific functions

---

## Security Checklist

- [x] Never commit `.env` file
- [x] Use environment variables for secrets
- [x] Validate all user input
- [x] Use RLS policies on all tables
- [x] Check `auth.uid()` in security-critical code
- [x] Never expose Service Role Key in frontend

---

## Monitoring

### Check Logs
```bash
# Supabase logs
Visit: https://app.supabase.com → Project → Logs

# Frontend logs
Browser Developer Tools (F12) → Console tab

# Build logs
npm run build:web 2>&1 | tail -50
```

### Key Metrics
- Active users this month
- Jobs completed per day
- Collector earnings total
- Reward points issued
- Payment status distribution

---

## Getting Help

1. **App won't start?** → Check `.env` file
2. **Database errors?** → Check Supabase logs
3. **Type errors?** → Run `npm run typecheck`
4. **Build fails?** → Run `npm run lint`
5. **Real-time not working?** → Check subscriptions in Supabase
6. **Metrics wrong?** → Refresh admin dashboard

---

## Production Checklist

Before deploying:
- [ ] Update `.env` with production credentials
- [ ] Verify all RLS policies in place
- [ ] Run `npm run typecheck` and `npm run lint`
- [ ] Test complete user flow
- [ ] Backup database
- [ ] Configure error tracking
- [ ] Set up monitoring
- [ ] Prepare deployment checklist

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for full details.

---

## Links & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev/docs
- **Expo Router**: https://expo.github.io/router/
- **Lucide Icons**: https://lucide.dev

---

## Contact & Support

For issues:
1. Check [SETUP.md](SETUP.md) troubleshooting section
2. Review error logs
3. Check Supabase dashboard
4. Reference [PROJECT_COMPLETION_REPORT.md](PROJECT_COMPLETION_REPORT.md)

---

**Last Updated**: May 7, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅

# CleanLinka Deployment Checklist

## Pre-Deployment Tasks

### Environment Setup
- [ ] Supabase project created
- [ ] Database tables migrated (via migration tool)
- [ ] RLS policies enabled on all tables
- [ ] Supabase URL noted
- [ ] Anon key noted
- [ ] Service Role Key noted (for edge functions)

### Configuration
- [ ] `.env` file created with Supabase credentials
- [ ] `.env.example` reviewed and matches actual setup
- [ ] No sensitive data in git
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] Linter passes (`npm run lint`)

### Testing
- [ ] Mobile app tested on iOS (via Expo Go)
- [ ] Mobile app tested on Android (via Expo Go)
- [ ] All authentication flows tested
- [ ] Dashboard loads and displays jobs
- [ ] Payment system creates records
- [ ] Rewards system awards points
- [ ] Real-time updates working
- [ ] Profile statistics calculate correctly
- [ ] Admin dashboard loads and shows metrics
- [ ] WhatsApp webhook responds

## Mobile App Deployment

### iOS Deployment
- [ ] EAS account created
- [ ] Development team certificate configured
- [ ] Provisioning profile created
- [ ] App version bumped (app.json)
- [ ] Release notes prepared
- [ ] Screenshots captured
- [ ] Build command: `eas build --platform ios --auto-submit`
- [ ] App Store submission completed
- [ ] TestFlight testing completed

### Android Deployment
- [ ] Google Play Console account created
- [ ] App signing key generated
- [ ] Release keystore configured
- [ ] App version bumped (app.json)
- [ ] Release notes prepared
- [ ] Screenshots captured (multiple densities)
- [ ] Build command: `eas build --platform android --auto-submit`
- [ ] Google Play submission completed
- [ ] Beta testing completed

### Expo Go Testing
- [ ] Development build created: `npm run dev`
- [ ] QR code scans correctly
- [ ] App loads on both iOS and Android
- [ ] All features functional
- [ ] No console errors

## Web Admin Dashboard Deployment

### Vercel Deployment
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Supabase credentials updated in HTML
- [ ] Deploy: `vercel --prod`
- [ ] URL configured in DNS
- [ ] SSL certificate active
- [ ] Admin can access dashboard

### Netlify Deployment
- [ ] Netlify account created
- [ ] Site connected to GitHub
- [ ] Supabase credentials updated in HTML
- [ ] Environment variables set (if needed)
- [ ] Deploy: `netlify deploy --prod`
- [ ] URL configured in DNS
- [ ] SSL certificate active

### Self-Hosted Deployment
- [ ] Server provisioned (AWS, GCP, Azure, etc.)
- [ ] Web server configured (nginx, Apache)
- [ ] SSL certificate installed
- [ ] Supabase credentials updated in HTML
- [ ] File uploaded to web root
- [ ] Dashboard accessible via domain
- [ ] CORS configured if needed

## Database Production Checks

### Data Integrity
- [ ] Backup created before production
- [ ] All tables populated with test data
- [ ] RLS policies verified
- [ ] Foreign key constraints active
- [ ] Indexes created for performance

### Security Audit
- [ ] Users table RLS: Users see only own data ✓
- [ ] Jobs table RLS: Collectors see pending jobs ✓
- [ ] Payments table RLS: Collectors see own payments ✓
- [ ] Rewards table RLS: Users see own rewards ✓
- [ ] No direct access to auth schema ✓
- [ ] Service role key secure ✓

### Performance Tuning
- [ ] Database connection pool configured
- [ ] Query performance monitored
- [ ] Indexes on foreign keys ✓
- [ ] Indexes on frequently filtered columns ✓
- [ ] Real-time subscriptions limit set
- [ ] Backup schedule configured

## Edge Functions Deployment

### WhatsApp Webhook
- [ ] Function deployed to Supabase
- [ ] CORS headers configured ✓
- [ ] Error handling tested
- [ ] Logs monitored
- [ ] Rate limiting configured (if needed)
- [ ] Webhook URL noted: `https://your-project.supabase.co/functions/v1/whatsapp-webhook`

### WhatsApp Integration
- [ ] WhatsApp Business account created
- [ ] Webhook registered with WhatsApp
- [ ] Webhook verified
- [ ] Test message sent
- [ ] Job created successfully from WhatsApp

## Monitoring & Logging

### Application Monitoring
- [ ] Sentry configured for error tracking
- [ ] Monitoring dashboard setup
- [ ] Alerts configured
- [ ] Performance metrics tracked
- [ ] User analytics enabled

### Database Monitoring
- [ ] Supabase monitoring dashboard checked
- [ ] Connection pool utilization monitored
- [ ] Slow query logs reviewed
- [ ] Storage usage monitored
- [ ] Backup status verified

### Security Monitoring
- [ ] Unauthorized access attempts logged
- [ ] Failed auth attempts monitored
- [ ] Rate limiting active
- [ ] API key rotation scheduled
- [ ] Security advisories checked

## Documentation

### Deployment Documentation
- [ ] README.md updated
- [ ] SETUP.md updated with production details
- [ ] ADMIN_DASHBOARD_SETUP.md created
- [ ] IMPLEMENTATION_SUMMARY.md created
- [ ] API documentation prepared
- [ ] Troubleshooting guide created

### Team Documentation
- [ ] Team access granted to Supabase
- [ ] Team access granted to App Store Connect
- [ ] Team access granted to Google Play Console
- [ ] Deployment procedures documented
- [ ] Incident response plan created
- [ ] On-call schedule established

## Post-Deployment

### Immediate (Day 1)
- [ ] App appears in app stores
- [ ] Admin dashboard accessible
- [ ] Real-time metrics updating
- [ ] No error alerts
- [ ] Team notified of deployment
- [ ] Update status page

### First Week
- [ ] Monitor for crashes
- [ ] Monitor for errors
- [ ] User feedback collected
- [ ] Performance baseline established
- [ ] Bug fixes deployed if needed
- [ ] Analytics reviewed

### First Month
- [ ] User adoption metrics reviewed
- [ ] Collector onboarding working
- [ ] Payment system functioning
- [ ] Rewards system calculating correctly
- [ ] Admin dashboard metrics accurate
- [ ] WhatsApp integration working
- [ ] Database performance acceptable

## Rollback Plan

If critical issues discovered:

1. **Mobile App**
   - Submit hotfix build immediately
   - Communicate ETA to users
   - Monitor for improvement

2. **Web Dashboard**
   - Revert to previous version
   - Communicate outage
   - Investigate root cause

3. **Database**
   - Restore from latest backup
   - Audit data integrity
   - Document incident

## Success Criteria

✅ **App Launches Successfully**
- No crashing on startup
- Authentication works
- Database queries succeed

✅ **Key Features Working**
- Residents can request pickups
- Collectors can accept jobs
- Payments created automatically
- Rewards calculated
- Real-time updates flowing

✅ **Admin Dashboard Operational**
- Metrics display correctly
- Data refreshes in real-time
- No console errors
- Responsive on mobile

✅ **No Critical Errors**
- Error rate < 0.1%
- 99% uptime achieved
- Response times < 2 seconds
- Database responsive

✅ **Security Verified**
- No unauthorized access
- Data properly encrypted
- RLS policies enforced
- API keys secure

## Production Support

### Support Contacts
- Supabase Support: https://supabase.com/support
- Expo Help: https://docs.expo.dev
- Team Lead: [contact info]
- On-Call Dev: [contact info]

### Escalation Path
1. Junior Dev → On-Call Dev
2. On-Call Dev → Tech Lead
3. Tech Lead → CTO
4. CTO → External Support (if needed)

### SLA Targets
- Critical bugs: 1 hour response
- Major features: 4 hour response
- Minor bugs: 24 hour response
- General support: 2 business days

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Developer | | | Approved |
| QA | | | Approved |
| Tech Lead | | | Approved |
| Product Manager | | | Approved |

---

**Deployment Date**: _______________

**Version**: 1.0.0

**Status**: Ready for Production ✅

# Admin Dashboard Setup Guide

## Overview

The CleanLinka Admin Dashboard is a web-based interface for managing waste collection operations, tracking metrics, and overseeing collectors and jobs.

## Features

- Real-time metrics (total pickups, active collectors, pending jobs, revenue)
- Job management with status filtering
- Collector management and verification
- Waste type analytics
- Beautiful, responsive design

## Quick Start

### Option 1: Local Testing

1. Open the HTML file in your browser:
   ```bash
   open public/admin-dashboard.html
   ```

### Option 2: Deploy to Web

#### Deploy to Vercel (Recommended)

1. Create account at [vercel.com](https://vercel.com)
2. Copy `public/admin-dashboard.html` to your project
3. Deploy:
   ```bash
   vercel --name cleanlinka-admin
   ```

#### Deploy to Netlify

1. Create account at [netlify.com](https://netlify.com)
2. Drag and drop `public/admin-dashboard.html`
3. Dashboard is live!

#### Deploy to GitHub Pages

1. Create `gh-pages` branch
2. Copy file to `/docs` folder
3. Enable GitHub Pages in settings
4. Access at `your-username.github.io/cleanlinka-admin`

## Configuration

### Step 1: Get Supabase Credentials

1. Go to your Supabase dashboard
2. Navigate to **Settings > API**
3. Copy your:
   - **Project URL** (e.g., `https://project-id.supabase.co`)
   - **Anon/Public Key** (visible on API page)

### Step 2: Update Credentials in Dashboard

Edit `public/admin-dashboard.html` and find this section:

```javascript
const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

Replace with your actual credentials:

```javascript
const supabaseUrl = 'https://my-project-xyz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Step 3: Deploy

Push the updated file to your hosting provider.

## Dashboard Features

### Metrics Section

Displays 4 key metrics:
- **Total Pickups**: All jobs completed
- **Active Collectors**: Verified collectors
- **Pending Jobs**: Jobs awaiting assignment
- **Total Revenue**: Sum of paid jobs

Updates automatically as data changes.

### Recent Jobs Section

Shows latest 10 jobs with:
- Job ID (truncated)
- Requester name
- Waste type
- Current status (color-coded)
- Creation date

**Filter by status**: Use the dropdown to view jobs by status (pending, accepted, completed).

### Collectors Section

Lists verified waste collectors with:
- Full name
- Email address
- Verification status (Verified/Pending)

### Waste Analytics

Breakdown of all waste collected by type:
- Recyclable items count
- Organic waste count
- Mixed waste count
- Hazardous waste count

Real-time updates as new jobs are created.

## URL Structure

If self-hosting, you can organize multiple admin dashboards:

```
/admin-dashboard.html          # Main dashboard
/admin-dashboards/
  ├── collectors.html          # Collector management
  ├── jobs.html                # Job tracking
  └── analytics.html           # Waste analytics
```

## Security Notes

- The dashboard uses Supabase RLS for data protection
- Only public data is accessible to the anon key
- Personal information is protected by RLS policies
- To access restricted admin features, you would need:
  - Admin user role in database
  - Service Role Key (never expose this in frontend)

## Customization

### Add Navigation

```html
<nav style="background: #0b6b3a; color: white; padding: 16px;">
  <a href="dashboard.html">Dashboard</a>
  <a href="collectors.html">Collectors</a>
  <a href="jobs.html">Jobs</a>
</nav>
```

### Change Colors

Update the CSS variables:
```css
:root {
  --primary-color: #0b6b3a;
  --accent-color: #f47b20;
  --background-color: #f5f5f5;
}
```

### Add Export Feature

```javascript
function exportData() {
  const csv = data.map(row => `${row.id},${row.name},${row.status}`).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.csv';
  a.click();
}
```

## Troubleshooting

### Dashboard shows "No data"

1. Check Supabase credentials in HTML
2. Verify database has data (check in Supabase dashboard)
3. Check browser console for errors (F12)
4. Ensure RLS policies allow access

### Metrics showing wrong numbers

1. Clear browser cache (Ctrl+Shift+Delete)
2. Reload the page
3. Check database for duplicate records
4. Verify RLS policies

### Cannot load data

1. Check internet connection
2. Verify Supabase is online
3. Check Supabase quota (Storage, API calls)
4. Look for CORS errors in browser console

## Performance Tips

- Dashboard loads ~10 recent jobs (configurable via `.limit()`)
- Metrics query optimized with indexes
- Real-time updates disabled for better performance
- Consider adding pagination for large datasets

## Advanced Configuration

### Add Real-time Updates

```javascript
const subscription = supabase
  .channel('jobs')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'jobs' },
    (payload) => {
      console.log('Job updated!', payload);
      loadJobs(); // Refresh jobs
    }
  )
  .subscribe();
```

### Add User Authentication

```javascript
async function authenticateUser() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@cleanlinka.com',
    password: 'secure-password'
  });
  
  if (error) {
    document.getElementById('error-container').innerHTML = 
      `<div class="error">Authentication failed</div>`;
  }
}
```

### Export Data to CSV

```javascript
function exportMetrics() {
  const csv = `Metric,Value\nTotal Pickups,${metrics.totalPickups}\n...`;
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadFile(blob, 'metrics.csv');
}
```

## Support

For issues with the admin dashboard:
1. Check browser console (F12) for errors
2. Verify Supabase credentials
3. Test with sample data in Supabase
4. Check Supabase logs for API errors

## Next Steps

1. **Customize**: Add your logo, colors, branding
2. **Enhance**: Add filters, exports, charts
3. **Secure**: Add authentication layer
4. **Scale**: Add more detailed analytics

---

**Dashboard Status**: Ready for Deployment

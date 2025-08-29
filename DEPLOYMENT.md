# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Connect to Vercel

1. **Go to [Vercel](https://vercel.com)** and sign in with your GitHub account
2. **Import your repository**:
   - Click "New Project"
   - Select your `crypto_reviews` repository
   - Vercel will automatically detect it's a Next.js project

### Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-openai-key

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bycppjugjhyvhfxlgxej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# CoinMarketCap API
COINMARKETCAP_API_KEY=your-coinmarketcap-key

# Cron Secret (for automated tasks)
CRON_SECRET=your-secure-cron-secret
```

### Step 3: Deploy

1. **Automatic Deployment**: Vercel will automatically deploy when you push to the `main` branch
2. **Manual Deployment**: Click "Deploy" in the Vercel dashboard

### Step 4: Configure Database

1. **Run Database Migration**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration from `migrate-add-unique-constraint.sql`

2. **Verify Database Connection**:
   - Visit: `https://your-domain.vercel.app/api/debug/test-save`
   - Should return success message

## 🌐 Deploy to Other Platforms

### Netlify

1. **Connect to Netlify**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify init
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   netlify deploy --prod
   ```

3. **Set Environment Variables** in Netlify dashboard

### Railway

1. **Connect to Railway**:
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Railway will auto-detect Next.js

2. **Set Environment Variables** in Railway dashboard

3. **Deploy**: Railway will automatically deploy on push

### DigitalOcean App Platform

1. **Create App**:
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select Next.js as the framework

2. **Configure Environment Variables**

3. **Deploy**: App Platform will handle the deployment

## 🔧 Production Configuration

### Build Optimization

1. **Update `next.config.js`**:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'standalone',
     experimental: {
       optimizeCss: true,
     },
     images: {
       domains: ['s2.coinmarketcap.com', 'assets.coingecko.com'],
     },
   }
   
   module.exports = nextConfig
   ```

2. **Environment Variables**:
   - Ensure all API keys are set
   - Use production URLs for Supabase
   - Set `NODE_ENV=production`

### Performance Optimization

1. **Enable Caching**:
   ```javascript
   // In API routes
   export const revalidate = 3600 // 1 hour
   ```

2. **Image Optimization**:
   - Use Next.js Image component
   - Configure image domains

3. **Database Connection Pooling**:
   - Supabase handles this automatically
   - Monitor connection limits

## 🔍 Post-Deployment Checklist

### ✅ Database Setup
- [ ] Run migration scripts
- [ ] Test database connection
- [ ] Verify RLS policies
- [ ] Test save/retrieve functionality

### ✅ API Testing
- [ ] Test `/api/health` endpoint
- [ ] Test `/api/debug/test-save` endpoint
- [ ] Verify OpenAI integration
- [ ] Test coin data APIs

### ✅ Frontend Testing
- [ ] Test TradingView charts
- [ ] Verify responsive design
- [ ] Test review generation
- [ ] Check error handling

### ✅ Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Monitor API response times
- [ ] Test loading states

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**:
   - Check Vercel dashboard
   - Redeploy after adding variables

2. **Database Connection Failed**:
   - Verify Supabase credentials
   - Check RLS policies
   - Test with `node test-supabase-simple.js`

3. **Build Failures**:
   - Check TypeScript errors
   - Verify all dependencies installed
   - Check for missing environment variables

4. **API Errors**:
   - Check API rate limits
   - Verify API keys are valid
   - Monitor error logs

### Debug Commands

```bash
# Test database connection
node test-supabase-simple.js

# Build locally
npm run build

# Start production server
npm start

# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
```

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user behavior

### Supabase Monitoring
- Check database logs
- Monitor query performance
- Track API usage

### Error Tracking
- Set up error monitoring (Sentry, LogRocket)
- Monitor API failures
- Track user-reported issues

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 Scaling Considerations

### Database Scaling
- Supabase automatically scales
- Monitor connection limits
- Consider read replicas for high traffic

### API Rate Limits
- Monitor OpenAI API usage
- Implement caching for coin data
- Consider CDN for static assets

### Performance Optimization
- Enable Next.js caching
- Optimize images and assets
- Monitor bundle size

---

**Note**: Always test thoroughly in a staging environment before deploying to production.

# 🚀 Crypto AI Insights - Setup Guide

## 📋 Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- OpenAI API key (optional for AI features)

## 🔧 Step-by-Step Setup

### 1. 🗄️ Supabase Database Setup

#### Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new project:
   - **Name**: `crypto-ai-insights`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users

#### Get Database Credentials
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

#### Create Database Tables
1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to create all tables and policies

### 2. 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI API (for AI analysis generation)
OPENAI_API_KEY=your-openai-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Cron Job Secret (for production)
CRON_SECRET=your-cron-secret-key-here

# Optional: CoinGecko API (for rate limiting)
COINGECKO_API_KEY=your-coingecko-api-key-here
```

### 3. 🤖 OpenAI API Setup (Optional)

1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Create a new API key
5. Add it to `.env.local` as `OPENAI_API_KEY`

### 4. 🧪 Test Your Setup

Run the test script to verify everything works:

```bash
node test-supabase-simple.js
```

You should see: `✅ Supabase connection successful!`

### 5. 🚀 Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your website!

## 🔍 Troubleshooting

### Common Issues

#### ❌ "Invalid URL" Error
- Make sure your Supabase URL is correct
- Check that `.env.local` file exists and has correct values

#### ❌ "Connection failed" Error
- Verify you ran the SQL schema in Supabase
- Check that your anon key is correct
- Ensure your Supabase project is active

#### ❌ "Module not found" Error
- Run `npm install` to install dependencies
- Make sure you're in the correct directory

### 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **OpenAI Platform**: https://platform.openai.com
- **CoinGecko API**: https://www.coingecko.com/en/api

## 📊 Database Tables Created

- **`analyses`** - Stores AI-generated cryptocurrency analyses
- **`coins_queue`** - Manages which coins to analyze next
- **`user_votes`** - Tracks user voting on analyses
- **`comments`** - Stores user comments on analyses

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use Row Level Security (RLS) policies in Supabase
- Keep your API keys secure
- Use environment variables for all sensitive data

## 🚀 Next Steps

1. **Test the website** - Navigate through all pages
2. **Add real data** - Generate some AI analyses
3. **Customize styling** - Modify colors and branding
4. **Deploy to production** - Use Vercel or similar platform

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure database tables are created properly
4. Check browser console for JavaScript errors

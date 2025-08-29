# Crypto AI Insights

A comprehensive cryptocurrency analysis platform that provides AI-powered reviews, technical analysis, and market insights for various cryptocurrencies.

## 🚀 Features

- **AI-Powered Reviews**: Generate detailed cryptocurrency analyses using OpenAI
- **TradingView Charts**: Interactive price charts with volume analysis
- **Technical Analysis**: Moving averages, Bollinger Bands, MACD indicators
- **Social Sentiment**: Twitter and Reddit sentiment analysis
- **Price Predictions**: AI-generated price forecasts with confidence levels
- **Database Persistence**: Reviews saved to Supabase database
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Recent Fixes (Latest Update)

### Database Issues Fixed
- ✅ **Review Persistence**: Fixed issue where generated reviews were disappearing
- ✅ **Unique Constraint**: Added `UNIQUE` constraint on `coin_id` in analyses table
- ✅ **Upsert Functionality**: Reviews can now be updated and persist after server restart
- ✅ **Enhanced Error Handling**: Better logging and fallback mechanisms

### TradingView Chart Improvements
- ✅ **Symbol Resolution**: Fixed coin ID to symbol conversion for charts
- ✅ **Volume Display**: Removed duplicate volume tables, now shows as overlay
- ✅ **Better Functionality**: Enhanced chart configuration and error handling
- ✅ **Responsive Design**: Charts adapt to different screen sizes

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Charts**: TradingView Widget, Chart.js
- **AI**: OpenAI GPT-4
- **APIs**: CoinGecko, CoinMarketCap

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/baierf-spec/crypto_reviews.git
   cd crypto_reviews
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE=your_supabase_service_role
   COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
   ```

4. **Set up database**
   - Go to your Supabase dashboard
   - Run the SQL commands from `supabase-schema.sql`
   - Run the migration from `migrate-add-unique-constraint.sql`

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

### Required Migration
To fix review persistence issues, run this migration in your Supabase SQL Editor:

```sql
-- Add unique constraint on coin_id
ALTER TABLE analyses ADD CONSTRAINT analyses_coin_id_unique UNIQUE (coin_id);
```

See `FIX-DATABASE.md` for detailed instructions.

## 🧪 Testing

### Database Connection Test
```bash
node test-supabase-simple.js
```

### API Endpoints Test
- Database save test: `http://localhost:3000/api/debug/test-save`
- Health check: `http://localhost:3000/api/health`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── reviews/           # Review pages
│   └── ...
├── components/            # React components
│   ├── TradingViewChart.tsx
│   ├── PriceChart.tsx
│   └── ...
├── lib/                   # Utility functions
│   ├── supabase.ts       # Database operations
│   ├── analysisGenerator.ts
│   └── ...
└── types/                 # TypeScript types
```

## 🔧 Key Components

### TradingView Chart
- **File**: `src/components/TradingViewChart.tsx`
- **Features**: Interactive charts, volume overlay, technical indicators
- **Configuration**: Dark theme, responsive design, error handling

### Database Operations
- **File**: `src/lib/supabase.ts`
- **Features**: CRUD operations, upsert functionality, error handling
- **Fallback**: Memory storage when database is unavailable

### Analysis Generation
- **File**: `src/lib/analysisGenerator.ts`
- **Features**: AI-powered analysis, sentiment analysis, price predictions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🔍 Troubleshooting

### Reviews Not Saving
1. Check Supabase connection: `node test-supabase-simple.js`
2. Verify unique constraint: Run migration in Supabase
3. Check environment variables
4. Test save functionality: `/api/debug/test-save`

### Charts Not Loading
1. Verify symbol resolution in `PriceChart.tsx`
2. Check TradingView widget configuration
3. Ensure coin ID to symbol mapping exists

### Database Issues
1. Check Supabase logs
2. Verify RLS policies
3. Test connection with service role key

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review `FIX-DATABASE.md` for database issues
- Open an issue on GitHub

---

**Note**: This project requires API keys for OpenAI, Supabase, and CoinMarketCap. Make sure to set up all environment variables before running.

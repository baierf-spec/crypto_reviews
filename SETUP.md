# 🚀 Crypto AI Insights - Setup Guide

## 📋 **Naujos Funkcijos:**

### **🔍 Geresnė Paieška:**
- **CoinMarketCap API** - 10,000+ monetų (vietoj CoinGecko 1000)
- **Išplėsta paieška** - ieško pagal pavadinimą ir simbolį
- **Real-time duomenys** - atnaujinami kas 5 minutes
- **Fallback sistema** - jei CoinMarketCap neveikia, naudoja CoinGecko

### **📊 Duomenų Šaltiniai:**
1. **CoinMarketCap API** (pagrindinis)
   - 10,000+ kriptovaliutų
   - Real-time kainos
   - Detalūs duomenys
   
2. **CoinGecko API** (atsarginis)
   - 1000+ kriptovaliutų
   - Nemokamas
   - Rate limiting

## 🔧 **Sąranka:**

### **1. Sukurkite .env.local failą:**

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# CoinMarketCap API (NAUJAS!)
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cron Job Secret
CRON_SECRET=your_cron_secret_here
```

### **2. Gaukite CoinMarketCap API raktą:**

1. Eikite į [CoinMarketCap Developer Portal](https://coinmarketcap.com/api/)
2. Užsiregistruokite nemokamai
3. Sukurkite API raktą
4. Nemokamas planas: 10,000 užklausų per mėnesį

### **3. Paleiskite serverį:**

```bash
cd crypto-ai-insights
npm run dev
```

## 🎯 **Naujos Paieškos Funkcijos:**

### **Paieška:**
- **Real-time paieška** - rezultatai atsiranda 300ms vėlavimu
- **Išplėsta paieška** - ieško visame CoinMarketCap duomenų bazėje
- **Debounced search** - mažiau API užklausų
- **Loading states** - rodo, kad paieška vyksta

### **Duomenų Kokybė:**
- **Daugiau monetų** - 10,000+ vietoj 1000
- **Geresni duomenys** - market cap, volume, supply info
- **Atnaujinti paveikslėliai** - CoinMarketCap CDN
- **Error handling** - fallback į CoinGecko

## 📈 **SEO Privalumai:**

### **Daugiau Turinio:**
- **10,000+ puslapių** - kiekviena moneta turi savo puslapį
- **Gerinti indeksavimą** - Google randa daugiau puslapių
- **Long-tail keywords** - kiekviena moneta turi unikalius raktinius žodžius

### **Sitemap Atnaujinimas:**
- **Dinamiškas sitemap.xml** - visos monetos įtrauktos
- **robots.txt** - leidžia indeksuoti visus puslapius
- **Meta tags** - kiekvienam puslapiui

## 🔄 **API Endpoint'ai:**

### **Paieška:**
```
GET /api/search?q=bitcoin&limit=50
```

### **Monetų sąrašas:**
```
GET /api/coins?limit=2000
```

### **Konkreti moneta:**
```
GET /api/coins/bitcoin
```

## 🚀 **Paleidimas:**

1. **Įdėkite API raktus** į `.env.local`
2. **Paleiskite serverį:** `npm run dev`
3. **Eikite į:** `http://localhost:3000/search`
4. **Ieškokite bet kokios monetos!**

## 📊 **Palyginimas:**

| Funkcija | Senoji Sistema | Nauja Sistema |
|----------|----------------|---------------|
| Monetų skaičius | 1,000 | 10,000+ |
| Paieška | Lokali | API-powered |
| Duomenų šaltinis | CoinGecko | CoinMarketCap |
| Rate limiting | 50/min | 10,000/mėn |
| SEO puslapiai | 1,000 | 10,000+ |

## 🎉 **Rezultatas:**

Dabar turite **profesionalią kriptovaliutų paieškos sistemą** su:
- ✅ 10,000+ monetų
- ✅ Real-time paieška
- ✅ Geresni duomenys
- ✅ SEO optimizuota
- ✅ Scalable architektūra

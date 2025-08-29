// Simple Supabase Connection Test
// Run with: node test-supabase-simple.js

const { createClient } = require('@supabase/supabase-js')

// Use the actual values from .env.local
const supabaseUrl = 'https://bycppjugjhyvhfxlgxej.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5Y3BwanVnamh5dmhmeGxneGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxOTk1MTcsImV4cCI6MjA3MTc3NTUxN30.eAmV6J72c77t2q6sF6Ebanr0MPlqFCEE8PTl_4g6qPY'

console.log('📝 Current Supabase URL:', supabaseUrl)
console.log('🔑 Current Supabase Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'Not set')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('analyses')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      console.log('💡 Make sure you have:')
      console.log('   1. Created the database tables using supabase-schema.sql')
      console.log('   2. Set up Row Level Security policies')
      return
    }
    
    console.log('✅ Supabase connection successful!')
    
    // Test table structure
    const { data: analysesCount } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📈 Analyses table: ${analysesCount?.length || 0} records`)
    
    // Test insert
    const testAnalysis = {
      coin_id: 'test-coin-' + Date.now(),
      coin_name: 'Test Coin',
      coin_symbol: 'TEST',
      content: 'Test analysis content',
      date: new Date().toISOString(),
      ratings: { sentiment: 3, onChain: 3, eco: 3, overall: 3 },
      price_prediction: null,
      on_chain_data: { transactions_24h: 0, whale_activity: 'Low', network_growth: 0 },
      social_sentiment: { twitter_score: 0, reddit_score: 0, overall_score: 0 },
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('analyses')
      .insert([testAnalysis])
      .select('id, coin_id')
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message)
    } else {
      console.log('✅ Insert test successful:', insertData)
      
      // Clean up test data
      await supabase
        .from('analyses')
        .delete()
        .eq('coin_id', testAnalysis.coin_id)
      
      console.log('🧹 Test data cleaned up')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testConnection()

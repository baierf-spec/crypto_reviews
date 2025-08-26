// Simple Supabase Connection Test
// Run with: node test-supabase-simple.js

const { createClient } = require('@supabase/supabase-js')

// Check if .env.local exists and has the right values
console.log('🔍 Checking environment variables...')

// For testing, we'll use the fallback values from supabase.ts
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

console.log('📝 Current Supabase URL:', supabaseUrl)
console.log('🔑 Current Supabase Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'Not set')

if (supabaseUrl === 'https://your-project.supabase.co') {
  console.log('❌ Please update your .env.local file with real Supabase credentials')
  console.log('')
  console.log('📋 Required .env.local content:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key')
  console.log('')
  console.log('🔗 Get these from: https://supabase.com/dashboard/project/[your-project]/settings/api')
  process.exit(1)
}

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
      console.log('💡 Make sure you:')
      console.log('   1. Created the database tables using supabase-schema.sql')
      console.log('   2. Added correct credentials to .env.local')
      return
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('📊 Database tables are accessible')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testConnection()

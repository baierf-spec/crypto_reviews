// Test Supabase Connection
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.log('Please add:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-project-url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
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
      return
    }
    
    console.log('✅ Supabase connection successful!')
    console.log('📊 Database tables are accessible')
    
    // Test table structure
    const { data: analysesCount } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
    
    console.log(`📈 Analyses table: ${analysesCount?.length || 0} records`)
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testConnection()

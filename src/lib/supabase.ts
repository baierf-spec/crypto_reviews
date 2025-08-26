import { createClient } from '@supabase/supabase-js'
import { getAnalysisFromMemory, getAllAnalysesFromMemory } from './analyses'

// Initialize Supabase client with fallback URLs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getLatestAnalyses(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.log('Supabase getLatestAnalyses failed:', error)
    // Fallback to memory storage: return all available analyses sorted by date
    const all = getAllAnalysesFromMemory()
    return all
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }
}

export async function getAnalysisByCoinId(coin_id: string) {
  try {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('coin_id', coin_id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.log('Supabase getAnalysisByCoinId failed:', error)
    // Fallback to memory storage
    return getAnalysisFromMemory(coin_id)
  }
}

export async function getCoinQueue() {
  try {
    const { data, error } = await supabase
      .from('coin_queue')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.log('Supabase getCoinQueue failed:', error)
    return []
  }
}

export async function updateCoinAnalysisDate(coin_id: string) {
  try {
    const { error } = await supabase
      .from('coin_queue')
      .update({ last_analyzed_date: new Date().toISOString() })
      .eq('coin_id', coin_id)

    if (error) throw error
    return true
  } catch (error) {
    console.log('Supabase updateCoinAnalysisDate failed:', error)
    return false
  }
}

export async function saveAnalysis(analysis: any) {
  try {
    const { error } = await supabase
      .from('analyses')
      .insert([analysis])

    if (error) throw error
    return true
  } catch (error) {
    console.log('Supabase saveAnalysis failed:', error)
    return false
  }
}

export async function addCoinToQueue({ coin_id, priority = 1 }: { coin_id: string; priority?: number }) {
  try {
    const { error } = await supabase
      .from('coin_queue')
      .insert([{
        coin_id,
        priority,
        created_at: new Date().toISOString()
      }])

    if (error) throw error
    return true
  } catch (error) {
    console.log('Supabase addCoinToQueue failed:', error)
    return false
  }
}

export async function getUserVotes(coin_id: string) {
  try {
    const { data, error } = await supabase
      .from('user_votes')
      .select('*')
      .eq('coin_id', coin_id)

    if (error) throw error
    return data || []
  } catch (error) {
    console.log('Supabase getUserVotes failed:', error)
    return []
  }
}

export async function addUserVote({ coin_id, user_ip }: { coin_id: string; user_ip: string }) {
  try {
    const { error } = await supabase
      .from('user_votes')
      .insert([{
        coin_id,
        user_ip,
        created_at: new Date().toISOString()
      }])

    if (error) throw error
    return true
  } catch (error) {
    console.log('Supabase addUserVote failed:', error)
    return false
  }
}

export async function getComments(analysis_id: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('analysis_id', analysis_id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.log('Supabase getComments failed:', error)
    return []
  }
}

export async function addComment(comment: any) {
  try {
    const { error } = await supabase
      .from('comments')
      .insert([comment])

    if (error) throw error
    return true
  } catch (error) {
    console.log('Supabase addComment failed:', error)
    return false
  }
}

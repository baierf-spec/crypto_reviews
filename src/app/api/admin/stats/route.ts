import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getAllAnalysesFromMemory } from '@/lib/analyses'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Try Supabase first
    let totalAnalyses: number | null = null
    let lastGenerated: string | null = null
    try {
      const { count } = await supabase
        .from('analyses')
        .select('id', { count: 'exact', head: true })
      totalAnalyses = count ?? null

      const { data: latest } = await supabase
        .from('analyses')
        .select('date')
        .order('date', { ascending: false })
        .limit(1)
      if (latest && latest.length > 0) {
        lastGenerated = latest[0].date as unknown as string
      }
    } catch (_) {
      // ignore; fall back to memory
    }

    // Fallback to memory store
    if (totalAnalyses == null || lastGenerated == null) {
      const mem = getAllAnalysesFromMemory()
      totalAnalyses = totalAnalyses ?? mem.length
      const last = mem.reduce<string | null>((acc, a) => {
        if (!acc) return a.date
        return new Date(a.date) > new Date(acc) ? a.date : acc
      }, null)
      lastGenerated = lastGenerated ?? last
    }

    // Derive total unique coins from memory (cheap approximation)
    const mem = getAllAnalysesFromMemory()
    const totalCoins = new Set(mem.map(a => a.coin_id)).size

    return NextResponse.json({
      success: true,
      totalAnalyses: totalAnalyses ?? 0,
      totalCoins,
      lastGenerated: lastGenerated ?? null,
      activeUsers: 0,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to compute stats' }, { status: 500 })
  }
}



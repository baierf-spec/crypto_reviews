import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result: any = {
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE),
    selectOk: false,
    selectError: null as null | string,
    count: null as null | number,
  }

  try {
    const { count, error } = await supabase
      .from('analyses')
      .select('id', { count: 'exact', head: true })

    if (error) {
      result.selectError = error.message
    } else {
      result.selectOk = true
      result.count = count ?? 0
    }
  } catch (e: any) {
    result.selectError = e?.message || 'unknown'
  }

  return NextResponse.json(result, { status: 200 })
}



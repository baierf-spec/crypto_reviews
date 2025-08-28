import { NextRequest, NextResponse } from 'next/server'
import { generateSeoTitle } from '@/lib/seo'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const coin = searchParams.get('coin')
    const keywords = searchParams.get('keywords')?.split(',').map(s => s.trim()).filter(Boolean)
    const yearParam = searchParams.get('year')
    const year = yearParam ? Number(yearParam) : undefined

    if (!coin) {
      return NextResponse.json({ error: 'Missing coin' }, { status: 400 })
    }

    const title = await generateSeoTitle(coin, { keywords, year })
    return NextResponse.json({ title })
  } catch (e) {
    return NextResponse.json({ error: 'SEO title generation failed' }, { status: 500 })
  }
}



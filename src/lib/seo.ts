import OpenAI from 'openai'

function getOpenAI(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  return new OpenAI({ apiKey })
}

export async function generateSeoTitle(
  coinName: string,
  options?: {
    keywords?: string[]
    context?: string
    year?: number
  }
): Promise<string> {
  const year = options?.year ?? new Date().getFullYear()
  const baseKeywords = options?.keywords && options.keywords.length
    ? options.keywords
    : ['AI Analysis', 'Review', 'Price Prediction']
  const context = options?.context || 'crypto, investment, trends'

  const openai = getOpenAI()
  if (!openai) {
    // Fallback deterministic title (≤ 65 chars where possible)
    const kw = baseKeywords[0]
    return `${coinName} ${kw} ${year} — Forecast & Investment Trends`
  }

  const prompt = `You are an SEO expert. Create ONE unique HTML <title> (no quotes) for a cryptocurrency review page.
Requirements:
- Include the exact coin name: ${coinName}
- Include at least ONE of these keyword phrases: ${baseKeywords.join(', ')}
- Vary synonyms and word order; keep it natural and compelling
- Add brief context such as ${year}, forecast, investment, or trends
- Keep under 62 characters when possible, max 70
- Output ONLY the title text, no quotes or extra text.`

  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.65,
      messages: [
        { role: 'system', content: 'You craft concise, high-CTR SEO titles.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 64,
    })
    const title = resp.choices[0]?.message?.content?.trim()
    if (title) return title.replace(/^"|"$/g, '')
  } catch (e) {
    console.error('SEO title generation failed:', e)
  }
  const kw = baseKeywords[0]
  return `${coinName} ${kw} ${year} — Forecast & Investment Trends`
}



'use client'

import { useState, useEffect } from 'react'
import { 
  Database, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  RefreshCw,
  BarChart3,
  Users,
  Zap
} from 'lucide-react'

export default function AdminPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState<any>(null)
  const [apiReady, setApiReady] = useState<boolean | null>(null)
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalCoins: 0,
    lastGenerated: null,
    activeUsers: 0
  })
  const [health, setHealth] = useState<any>(null)

  // Load stats on mount
  useEffect(() => {
    let isMounted = true
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) return
        const data = await res.json()
        if (isMounted && data.success) {
          setStats({
            totalAnalyses: data.totalAnalyses ?? 0,
            totalCoins: data.totalCoins ?? 0,
            lastGenerated: data.lastGenerated ?? null,
            activeUsers: data.activeUsers ?? 0,
          })
        }
      } catch (_) {}
    }
    loadStats()
    // DB Health
    async function loadHealth() {
      try {
        const res = await fetch('/api/admin/health')
        const data = await res.json()
        if (isMounted) setHealth(data)
      } catch (_) {}
    }
    loadHealth()
    // Bulk API readiness
    async function checkBulkReady() {
      try {
        const res = await fetch('/api/bulk-generate')
        setApiReady(res.ok)
      } catch {
        setApiReady(false)
      }
    }
    checkBulkReady()
    return () => { isMounted = false }
  }, [])

  const handleBulkGeneration = async (limit: number) => {
    setIsGenerating(true)
    setGenerationProgress(null)

    try {
      const response = await fetch('/api/bulk-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit,
          batch_size: 10
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setGenerationProgress(data.results)
        console.log('Bulk generation completed:', data)
      } else {
        console.error('Bulk generation failed:', data)
      }
    } catch (error) {
      console.error('Error during bulk generation:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-crypto-primary py-8 px-4 sm:px-6 lg:px-8">
      {/* noindex for admin */}
      <meta name="robots" content="noindex,nofollow" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage bulk analysis generation, monitor system performance, and track SEO optimization progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Analyses</p>
                <p className="text-2xl font-bold text-white">{stats.totalAnalyses.toLocaleString()}</p>
              </div>
              <Database className="w-8 h-8 text-crypto-accent" />
            </div>
          </div>

          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Coins Analyzed</p>
                <p className="text-2xl font-bold text-white">{stats.totalCoins.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Last Generated</p>
                <p className="text-lg font-semibold text-white">
                  {stats.lastGenerated ? new Date(stats.lastGenerated).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-crypto-secondary/50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Created (24h)</p>
                <p className="text-2xl font-bold text-white">{(health?.created24h ?? 0).toLocaleString?.() || 0}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-crypto-accent" />
            </div>
          </div>
        </div>

        {/* Bulk Generation Section */}
        <div className="bg-crypto-secondary/50 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Bulk Analysis Generation</h2>
              <p className="text-gray-400">
                Generate analyses for multiple coins to improve SEO and organic traffic
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded ${apiReady===null ? 'bg-black/30 text-gray-300' : apiReady ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {apiReady===null ? 'Checking API…' : apiReady ? 'API Ready' : 'API Unavailable'}
              </span>
            <Zap className="w-8 h-8 text-crypto-accent" />
            </div>
          </div>

          {/* Generation Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => handleBulkGeneration(100)}
              disabled={isGenerating || apiReady===false}
              className="bg-crypto-accent hover:bg-crypto-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Generate 100</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleBulkGeneration(500)}
              disabled={isGenerating || apiReady===false}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Generate 500</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleBulkGeneration(1000)}
              disabled={isGenerating || apiReady===false}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Generate 1000</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Display */}
          {generationProgress && (
            <div className="bg-crypto-primary/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Generation Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{generationProgress.total_coins}</p>
                  <p className="text-gray-400 text-sm">Total Coins</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{generationProgress.successful}</p>
                  <p className="text-gray-400 text-sm">Successful</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{generationProgress.failed}</p>
                  <p className="text-gray-400 text-sm">Failed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{generationProgress.processed}</p>
                  <p className="text-gray-400 text-sm">Processed</p>
                </div>
              </div>

              {generationProgress.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-white font-semibold mb-2">Errors:</h4>
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 max-h-32 overflow-y-auto">
                    {generationProgress.errors.map((error: string, index: number) => (
                      <p key={index} className="text-red-400 text-sm">{error}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DB Health Section */}
        <div className="bg-crypto-secondary/50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Database Health</h2>
          {health ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-gray-400">Env Vars</p>
                <p className="text-white">URL: {health.env?.has_url ? 'OK' : 'Missing'}</p>
                <p className="text-white">Anon: {health.env?.has_anon ? 'OK' : 'Missing'}</p>
                <p className="text-white">Service: {health.env?.has_service ? 'OK' : 'Missing'}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-gray-400">Read</p>
                <p className={`font-semibold ${health.canRead ? 'text-green-400' : 'text-red-400'}`}>{health.canRead ? 'OK' : 'Failed'}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-gray-400">Write</p>
                <p className={`font-semibold ${health.canWrite ? 'text-green-400' : 'text-red-400'}`}>{health.canWrite ? 'OK' : 'Failed'}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4">
                <p className="text-gray-400">Last Test Write</p>
                <p className="text-white">{health.lastWrite ? new Date(health.lastWrite).toLocaleString() : '—'}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Checking database health…</p>
          )}
        </div>

        {/* SEO Benefits Section */}
        <div className="bg-crypto-secondary/50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">SEO Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Organic Traffic Growth</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>1000+ unique coin pages indexed by Google</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Long-tail keywords for each cryptocurrency</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Fresh, AI-generated content updated regularly</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Comprehensive analysis pages with high word count</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Content Strategy</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Each analysis includes 1000+ words of content</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Technical analysis, sentiment, and predictions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Structured data for better search visibility</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Internal linking between related coins</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Monitoring Section */}
        <div className="bg-crypto-secondary/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">System Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">API Response Time</span>
                  <span className="text-white font-semibold">~2.3s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-green-400 font-semibold">98.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Daily Generations</span>
                  <span className="text-white font-semibold">150+</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Bitcoin analysis updated 2 hours ago</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Ethereum analysis generated 4 hours ago</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Bulk generation completed 6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





                  <span>1000+ unique coin pages indexed by Google</span>


                </li>


                <li className="flex items-center space-x-2">


                  <CheckCircle className="w-4 h-4 text-green-400" />


                  <span>Long-tail keywords for each cryptocurrency</span>


                </li>


                <li className="flex items-center space-x-2">


                  <CheckCircle className="w-4 h-4 text-green-400" />


                  <span>Fresh, AI-generated content updated regularly</span>


                </li>


                <li className="flex items-center space-x-2">


                  <CheckCircle className="w-4 h-4 text-green-400" />


                  <span>Comprehensive analysis pages with high word count</span>


                </li>


              </ul>


            </div>


            <div>


              <h3 className="text-lg font-semibold text-white mb-3">Content Strategy</h3>


              <ul className="space-y-2 text-gray-300">


                <li className="flex items-center space-x-2">


                  <CheckCircle className="w-4 h-4 text-green-400" />


                  <span>Each analysis includes 1000+ words of content</span>


                </li>


                <li className="flex items-center space-x-2">


                  <CheckCircle className="w-4 h-4 text-green-400" />


                  <span>Technical analysis, sentiment, and predictions</span>


                </li>


                <li className="flex items-center space-x-2">


                  <CheckCircle className="w-4 h-4 text-green-400" />


                  <span>Structured data for better search visibility</span>


                </li>


                <li className="flex items-center space-x-2">


                  <CheckCircle className="w-4 h-4 text-green-400" />


                  <span>Internal linking between related coins</span>


                </li>


              </ul>


            </div>


          </div>


        </div>



        {/* Monitoring Section */}


        <div className="bg-crypto-secondary/50 rounded-lg p-8">


          <h2 className="text-2xl font-bold text-white mb-6">System Monitoring</h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


            <div>


              <h3 className="text-lg font-semibold text-white mb-3">Performance Metrics</h3>


              <div className="space-y-3">


                <div className="flex justify-between items-center">


                  <span className="text-gray-300">API Response Time</span>


                  <span className="text-white font-semibold">~2.3s</span>


                </div>


                <div className="flex justify-between items-center">


                  <span className="text-gray-300">Success Rate</span>


                  <span className="text-green-400 font-semibold">98.5%</span>


                </div>


                <div className="flex justify-between items-center">


                  <span className="text-gray-300">Daily Generations</span>


                  <span className="text-white font-semibold">150+</span>


                </div>


              </div>


            </div>


            <div>


              <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>


              <div className="space-y-2 text-sm">


                <div className="flex items-center space-x-2">


                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>


                  <span className="text-gray-300">Bitcoin analysis updated 2 hours ago</span>


                </div>


                <div className="flex items-center space-x-2">


                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>


                  <span className="text-gray-300">Ethereum analysis generated 4 hours ago</span>


                </div>


                <div className="flex items-center space-x-2">


                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>


                  <span className="text-gray-300">Bulk generation completed 6 hours ago</span>


                </div>


              </div>


            </div>


          </div>


        </div>


      </div>


    </div>


  )


}




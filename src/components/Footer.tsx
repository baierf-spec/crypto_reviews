import Link from 'next/link'
import { TrendingUp, Shield, AlertTriangle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-crypto-secondary/80 backdrop-blur-sm border-t border-crypto-primary/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-crypto-primary to-crypto-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Crypto AI Insights
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              AI-powered cryptocurrency analysis and predictions. Get daily insights on top coins with sentiment analysis, on-chain data, and eco ratings.
            </p>
            <div className="flex items-center space-x-2 text-yellow-500 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Not financial advice. AI-generated content.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-crypto-primary text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-400 hover:text-crypto-primary text-sm transition-colors">
                  Latest Reviews
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-400 hover:text-crypto-primary text-sm transition-colors">
                  Search Coins
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-gray-400 hover:text-crypto-primary text-sm transition-colors">
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-crypto-primary text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-crypto-primary text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-400 hover:text-crypto-primary text-sm transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-crypto-primary/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Crypto AI Insights. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

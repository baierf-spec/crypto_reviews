import { Brain, Database, TrendingUp, Shield, Zap, BarChart3, Users, Clock, Target, Award } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Crypto AI Insights | How Our AI Analyzes Cryptocurrencies',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            About Crypto AI Insights
          </h1>
          <p className="text-gray-400 text-lg">
            Revolutionizing cryptocurrency analysis with advanced AI technology
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Crypto AI Insights is dedicated to providing the most comprehensive and accurate cryptocurrency analysis 
              through the power of artificial intelligence. We combine cutting-edge machine learning algorithms with 
              real-time market data to deliver insights that help investors make informed decisions.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our platform analyzes thousands of data points daily, including market sentiment, on-chain metrics, 
              environmental impact, and social media trends to provide a holistic view of each cryptocurrency's potential.
            </p>
          </div>
        </section>

        {/* Technology */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-6">
              <div className="w-12 h-12 bg-crypto-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-crypto-primary" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-400 text-sm">
                Advanced machine learning models analyze market patterns, sentiment, and technical indicators 
                to provide accurate predictions and insights.
              </p>
            </div>

            <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-6">
              <div className="w-12 h-12 bg-crypto-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-crypto-accent" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Real-Time Data</h3>
              <p className="text-gray-400 text-sm">
                Continuous monitoring of blockchain networks, social media platforms, and market exchanges 
                to provide up-to-the-minute analysis.
              </p>
            </div>

            <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-6">
              <div className="w-12 h-12 bg-crypto-success/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-crypto-success" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Multi-Dimensional Metrics</h3>
              <p className="text-gray-400 text-sm">
                Comprehensive rating system that considers technical analysis, fundamental factors, 
                environmental impact, and community sentiment.
              </p>
            </div>

            <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-6">
              <div className="w-12 h-12 bg-crypto-warning/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-crypto-warning" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Environmental Focus</h3>
              <p className="text-gray-400 text-sm">
                Unique eco-rating system that evaluates the environmental impact of each cryptocurrency, 
                helping investors make sustainable choices.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-crypto-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-crypto-primary" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-crypto-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-crypto-accent" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-400 text-sm">Coins Analyzed</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-crypto-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-crypto-success" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400 text-sm">AI Monitoring</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-crypto-warning/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-crypto-warning" />
              </div>
              <div className="text-2xl font-bold text-white mb-2">99%</div>
              <div className="text-gray-400 text-sm">Accuracy Rate</div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mb-16">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Important Disclaimer</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                <strong>Not Financial Advice:</strong> All content on Crypto AI Insights is for educational and 
                informational purposes only. We do not provide financial advice, and our analysis should not be 
                considered as investment recommendations.
              </p>
              <p>
                <strong>AI-Generated Content:</strong> Our analyses are generated using artificial intelligence 
                and should be used as one of many tools in your research process. Always conduct your own due 
                diligence before making investment decisions.
              </p>
              <p>
                <strong>Risk Warning:</strong> Cryptocurrency investments carry significant risk. The value of 
                cryptocurrencies can be highly volatile, and you may lose some or all of your investment.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Our Team</h2>
          <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-8">
            <p className="text-gray-300 leading-relaxed mb-4">
              Crypto AI Insights is powered by a team of experienced developers, data scientists, and 
              blockchain experts who are passionate about democratizing access to high-quality cryptocurrency analysis.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our team combines expertise in machine learning, blockchain technology, and financial markets 
              to create the most advanced cryptocurrency analysis platform available.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

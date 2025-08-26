'use client'

import { motion } from 'framer-motion'
import { Brain, Database, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze market sentiment, social media trends, and technical indicators to provide comprehensive insights.',
    color: 'text-crypto-primary'
  },
  {
    icon: Database,
    title: 'On-Chain Analytics',
    description: 'Real-time blockchain data including transaction volume, whale movements, and network growth metrics for deeper market understanding.',
    color: 'text-crypto-accent'
  },
  {
    icon: TrendingUp,
    title: 'Daily Predictions',
    description: 'Get 10 unique cryptocurrency reviews daily with price predictions, risk assessments, and investment recommendations.',
    color: 'text-crypto-success'
  },
  {
    icon: Shield,
    title: 'Eco-Friendly Ratings',
    description: 'Environmental impact assessment for each cryptocurrency based on energy consumption and sustainability metrics.',
    color: 'text-crypto-warning'
  },
  {
    icon: Zap,
    title: 'Sentiment Analysis',
    description: 'Advanced social media sentiment analysis across Twitter, Reddit, and other platforms to gauge market mood.',
    color: 'text-crypto-primary'
  },
  {
    icon: BarChart3,
    title: 'Comprehensive Metrics',
    description: 'Multi-dimensional rating system including technical analysis, fundamental factors, and market dynamics.',
    color: 'text-crypto-accent'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Choose Crypto AI Insights?
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our advanced AI system combines multiple data sources to provide you with the most comprehensive cryptocurrency analysis available.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-6 hover:border-crypto-primary/40 transition-all duration-200 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`w-12 h-12 bg-crypto-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-crypto-primary/30 transition-colors`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-crypto-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="text-3xl font-bold text-crypto-primary mb-2">10+</div>
            <div className="text-gray-400 text-sm">Daily Reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-crypto-accent mb-2">1000+</div>
            <div className="text-gray-400 text-sm">Coins Analyzed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-crypto-success mb-2">99%</div>
            <div className="text-gray-400 text-sm">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-crypto-warning mb-2">24/7</div>
            <div className="text-gray-400 text-sm">AI Monitoring</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

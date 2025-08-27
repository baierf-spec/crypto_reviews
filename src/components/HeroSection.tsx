'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Zap, Shield, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-crypto-primary/10 via-transparent to-crypto-accent/10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-crypto-primary/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-crypto-accent/20 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Main heading */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-crypto-primary to-crypto-accent bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            Crypto Insights
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get daily cryptocurrency analysis with advanced AI sentiment analysis, 
            on-chain data, and eco-friendly ratings
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/reviews"
              className="bg-gradient-to-r from-crypto-primary to-crypto-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-crypto-primary/25 transition-all duration-200 transform hover:scale-105 text-center"
            >
              Explore Reviews
            </Link>
            <Link
              href="/about"
              className="border-2 border-crypto-primary/50 text-crypto-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-crypto-primary/10 transition-all duration-200 text-center"
            >
              How It Works
            </Link>
          </motion.div>

          {/* Features grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-crypto-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-crypto-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">Daily Analysis</h3>
              <p className="text-gray-400 text-sm">
                10 unique coin reviews every day
              </p>
            </div>

            <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-crypto-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-crypto-accent" />
              </div>
              <h3 className="text-white font-semibold mb-2">AI Sentiment</h3>
              <p className="text-gray-400 text-sm">
                Advanced social sentiment analysis
              </p>
            </div>

            <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-crypto-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-crypto-success" />
              </div>
              <h3 className="text-white font-semibold mb-2">On-Chain Data</h3>
              <p className="text-gray-400 text-sm">
                Real-time blockchain metrics
              </p>
            </div>

            <div className="bg-crypto-secondary/30 backdrop-blur-sm border border-crypto-primary/20 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-crypto-warning/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-crypto-warning" />
              </div>
              <h3 className="text-white font-semibold mb-2">Eco Ratings</h3>
              <p className="text-gray-400 text-sm">
                Environmental impact assessment
              </p>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            className="mt-12 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-yellow-400 text-sm text-center">
              ⚠️ Not financial advice. All content is AI-generated for educational purposes only.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

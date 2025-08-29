import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer - Crypto AI Insights',
  description: 'Important disclaimers and risk warnings for Crypto AI Insights cryptocurrency analysis services.',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Disclaimer</h1>
          <p className="text-gray-400 text-lg">Important information about our services and limitations</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ IMPORTANT RISK WARNING</h2>
            <div className="space-y-4 text-gray-300">
              <p className="text-red-300 font-semibold">
                Cryptocurrency investments are highly speculative and carry significant risks. You can lose some or all of your invested capital.
              </p>
              <p>
                The information provided on Crypto AI Insights is for educational and informational purposes only. It should not be considered as financial advice, investment recommendations, or any form of professional guidance.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. No Financial Advice</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Educational Purpose Only:</strong> All content, analysis, and insights provided on this website are for educational and informational purposes only.
              </p>
              <p>
                <strong className="text-white">Not Professional Advice:</strong> We are not licensed financial advisors, investment professionals, or legal experts. Our analysis should not be considered as professional financial advice.
              </p>
              <p>
                <strong className="text-white">Personal Responsibility:</strong> You are solely responsible for your investment decisions and should conduct your own research before making any financial commitments.
              </p>
              <p>
                <strong className="text-white">Consult Professionals:</strong> We strongly recommend consulting with qualified financial advisors, accountants, and legal professionals before making investment decisions.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Investment Risks</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Market Volatility:</strong> Cryptocurrency markets are extremely volatile and can experience significant price fluctuations in short periods.
              </p>
              <p>
                <strong className="text-white">Liquidity Risk:</strong> Some cryptocurrencies may have limited liquidity, making it difficult to buy or sell without affecting the price.
              </p>
              <p>
                <strong className="text-white">Regulatory Risk:</strong> Cryptocurrency regulations vary by jurisdiction and may change, potentially affecting the value and legality of certain investments.
              </p>
              <p>
                <strong className="text-white">Technology Risk:</strong> Cryptocurrencies rely on blockchain technology, which may be subject to technical failures, security breaches, or obsolescence.
              </p>
              <p>
                <strong className="text-white">Total Loss Risk:</strong> You may lose your entire investment. Never invest more than you can afford to lose.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. AI Analysis Limitations</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">AI Predictions:</strong> Our AI-generated analysis and predictions are based on historical data and mathematical models. They are not guaranteed to be accurate or reliable.
              </p>
              <p>
                <strong className="text-white">Data Dependencies:</strong> AI analysis depends on the quality, accuracy, and completeness of available market data, which may be incomplete, delayed, or inaccurate.
              </p>
              <p>
                <strong className="text-white">Market Changes:</strong> AI models may not account for sudden market changes, news events, or other factors that can significantly impact cryptocurrency prices.
              </p>
              <p>
                <strong className="text-white">No Guarantees:</strong> Past performance of AI analysis does not guarantee future results. Markets are unpredictable and can behave differently than historical patterns suggest.
              </p>
              <p>
                <strong className="text-white">Human Oversight Required:</strong> AI analysis should be used as a tool to supplement, not replace, human judgment, research, and due diligence.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Accuracy</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Third-Party Sources:</strong> We source data from various third-party providers including CoinMarketCap, CoinGecko, and blockchain networks. We do not guarantee the accuracy of this data.
              </p>
              <p>
                <strong className="text-white">Real-Time Data:</strong> While we strive to provide real-time data, there may be delays, errors, or inaccuracies in the information displayed.
              </p>
              <p>
                <strong className="text-white">Data Availability:</strong> Market data may be unavailable or incomplete for certain cryptocurrencies or time periods.
              </p>
              <p>
                <strong className="text-white">Verification:</strong> We recommend verifying all data independently before making investment decisions.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Environmental Impact</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Eco Ratings:</strong> Our environmental impact ratings are estimates based on available data and may not reflect the complete environmental footprint of cryptocurrencies.
              </p>
              <p>
                <strong className="text-white">Data Limitations:</strong> Environmental impact data for cryptocurrencies is often incomplete or based on estimates and assumptions.
              </p>
              <p>
                <strong className="text-white">Dynamic Nature:</strong> Environmental impact can change over time as mining methods, energy sources, and network protocols evolve.
              </p>
              <p>
                <strong className="text-white">Not Investment Criteria:</strong> Environmental ratings should not be the sole basis for investment decisions.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Social Sentiment Analysis</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Sentiment Limitations:</strong> Social sentiment analysis is based on publicly available social media data and may not reflect the complete market sentiment.
              </p>
              <p>
                <strong className="text-white">Data Sources:</strong> Sentiment data may be influenced by bots, manipulation, or incomplete coverage of social media platforms.
              </p>
              <p>
                <strong className="text-white">Timing:</strong> Sentiment analysis may not capture real-time changes in market sentiment or reflect future market movements.
              </p>
              <p>
                <strong className="text-white">Correlation vs Causation:</strong> Social sentiment may correlate with price movements but does not necessarily cause them.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. On-Chain Data</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Blockchain Data:</strong> On-chain data analysis is based on publicly available blockchain information and may not capture all relevant market activity.
              </p>
              <p>
                <strong className="text-white">Interpretation:</strong> On-chain metrics require careful interpretation and may not always indicate clear market trends or investment opportunities.
              </p>
              <p>
                <strong className="text-white">Privacy Considerations:</strong> Some blockchain transactions may be private or obfuscated, limiting the completeness of on-chain analysis.
              </p>
              <p>
                <strong className="text-white">Technical Complexity:</strong> On-chain data analysis involves complex technical concepts that may not be suitable for all investors.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">No Guarantee:</strong> We do not guarantee uninterrupted access to our services or the availability of any specific features or data.
              </p>
              <p>
                <strong className="text-white">Technical Issues:</strong> Our services may be subject to technical failures, maintenance, or other issues that could affect availability.
              </p>
              <p>
                <strong className="text-white">Third-Party Dependencies:</strong> Our services depend on third-party data providers and services that may experience outages or issues.
              </p>
              <p>
                <strong className="text-white">Updates and Changes:</strong> We may modify, suspend, or discontinue services at any time without notice.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. No Liability</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Disclaimer of Liability:</strong> We disclaim all liability for any losses, damages, or injuries arising from the use of our services or reliance on our analysis.
              </p>
              <p>
                <strong className="text-white">Investment Losses:</strong> We are not responsible for any investment losses, missed opportunities, or financial damages resulting from the use of our services.
              </p>
              <p>
                <strong className="text-white">Indirect Damages:</strong> We are not liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
              <p>
                <strong className="text-white">Force Majeure:</strong> We are not liable for any failure to perform due to circumstances beyond our reasonable control.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Acceptance of Risk</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                By using our services, you acknowledge and accept that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cryptocurrency investments carry significant risks</li>
                <li>You may lose some or all of your invested capital</li>
                <li>Our analysis is not financial advice</li>
                <li>You are responsible for your own investment decisions</li>
                <li>Past performance does not guarantee future results</li>
                <li>You should consult with qualified professionals before investing</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">📞 Contact Information</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                If you have any questions about this disclaimer or our services, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: disclaimer@crypto-ai-insights.com</li>
                <li>Website: https://www.crypto-ai-insights.com</li>
              </ul>
              <p className="text-yellow-300 font-semibold">
                Remember: Never invest more than you can afford to lose, and always do your own research!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



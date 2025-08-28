import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - Crypto AI Insights',
  description: 'Terms of service for Crypto AI Insights - Read our terms and conditions for using our cryptocurrency analysis services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                By accessing and using Crypto AI Insights ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Crypto AI Insights provides cryptocurrency analysis, market data, and AI-powered insights. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cryptocurrency price analysis and charts</li>
                <li>AI-generated market insights and predictions</li>
                <li>On-chain data analysis</li>
                <li>Social sentiment analysis</li>
                <li>Environmental impact ratings</li>
                <li>Market data from various sources</li>
              </ul>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Accurate Information:</strong> You must provide accurate and complete information when using our services.
              </p>
              <p>
                <strong className="text-white">Account Security:</strong> You are responsible for maintaining the confidentiality of your account information.
              </p>
              <p>
                <strong className="text-white">Acceptable Use:</strong> You agree not to use our services for any unlawful purpose or in any way that could damage, disable, overburden, or impair our servers.
              </p>
              <p>
                <strong className="text-white">No Manipulation:</strong> You agree not to attempt to manipulate or interfere with our services or data.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Investment Disclaimer</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Not Financial Advice:</strong> The information provided on Crypto AI Insights is for informational purposes only and should not be considered as financial advice.
              </p>
              <p>
                <strong className="text-white">Risk Warning:</strong> Cryptocurrency investments carry significant risks. You should conduct your own research and consult with qualified financial advisors before making investment decisions.
              </p>
              <p>
                <strong className="text-white">No Guarantees:</strong> We do not guarantee the accuracy, completeness, or usefulness of any information provided. Past performance does not indicate future results.
              </p>
              <p>
                <strong className="text-white">Market Volatility:</strong> Cryptocurrency markets are highly volatile and unpredictable. You acknowledge that you may lose some or all of your investment.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. AI Analysis Disclaimer</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">AI Limitations:</strong> Our AI analysis is based on available data and algorithms. AI predictions and insights are not guaranteed to be accurate or reliable.
              </p>
              <p>
                <strong className="text-white">Data Dependencies:</strong> AI analysis depends on the quality and availability of market data, which may be incomplete or delayed.
              </p>
              <p>
                <strong className="text-white">No Liability:</strong> We are not liable for any decisions made based on AI-generated insights or analysis.
              </p>
              <p>
                <strong className="text-white">Human Oversight:</strong> AI analysis should be used as a tool to supplement, not replace, human judgment and research.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Data and Information</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Third-Party Data:</strong> We source data from various third-party providers including CoinMarketCap, CoinGecko, and blockchain networks. We do not guarantee the accuracy of this data.
              </p>
              <p>
                <strong className="text-white">Real-Time Data:</strong> Market data is provided in real-time but may be subject to delays or inaccuracies.
              </p>
              <p>
                <strong className="text-white">Data Usage:</strong> You may use our data for personal research and analysis, but commercial use requires written permission.
              </p>
              <p>
                <strong className="text-white">Data Availability:</strong> We strive to maintain high availability but do not guarantee uninterrupted access to our services.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Our Rights:</strong> All content, features, and functionality on Crypto AI Insights are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                <strong className="text-white">Limited License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use our services for personal, non-commercial purposes.
              </p>
              <p>
                <strong className="text-white">Restrictions:</strong> You may not copy, modify, distribute, sell, or lease any part of our services without written permission.
              </p>
              <p>
                <strong className="text-white">User Content:</strong> You retain ownership of any content you submit, but grant us a license to use it in connection with our services.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">No Warranty:</strong> Our services are provided "as is" without any warranties, express or implied.
              </p>
              <p>
                <strong className="text-white">Limitation:</strong> In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
              <p>
                <strong className="text-white">Maximum Liability:</strong> Our total liability to you for any claims shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
              <p>
                <strong className="text-white">Force Majeure:</strong> We are not liable for any failure to perform due to circumstances beyond our reasonable control.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Service Modifications</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Changes:</strong> We reserve the right to modify, suspend, or discontinue any part of our services at any time.
              </p>
              <p>
                <strong className="text-white">Notice:</strong> We will provide reasonable notice of significant changes when possible.
              </p>
              <p>
                <strong className="text-white">No Compensation:</strong> We are not liable for any losses resulting from service modifications or discontinuation.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Your Rights:</strong> You may terminate your use of our services at any time.
              </p>
              <p>
                <strong className="text-white">Our Rights:</strong> We may terminate or suspend your access to our services for violations of these terms.
              </p>
              <p>
                <strong className="text-white">Effect:</strong> Upon termination, your right to use our services ceases immediately.
              </p>
              <p>
                <strong className="text-white">Survival:</strong> Certain provisions of these terms will survive termination.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                These terms are governed by and construed in accordance with the laws of the jurisdiction in which we operate. Any disputes shall be resolved in the courts of that jurisdiction.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                If you have any questions about these terms of service, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: legal@crypto-ai-insights.com</li>
                <li>Website: https://www.crypto-ai-insights.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

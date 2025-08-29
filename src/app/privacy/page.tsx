import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - Crypto AI Insights',
  description: 'Privacy policy for Crypto AI Insights - Learn how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Personal Information:</strong> We may collect personal information such as your email address when you request AI analysis or sign up for our services.
              </p>
              <p>
                <strong className="text-white">Usage Data:</strong> We collect information about how you interact with our website, including pages visited, time spent on pages, and features used.
              </p>
              <p>
                <strong className="text-white">Technical Data:</strong> We automatically collect technical information such as your IP address, browser type, device information, and operating system.
              </p>
              <p>
                <strong className="text-white">Cryptocurrency Data:</strong> We collect and analyze publicly available cryptocurrency data from various sources including CoinMarketCap, CoinGecko, and blockchain networks.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Service Provision:</strong> To provide you with cryptocurrency analysis, AI insights, and market data.
              </p>
              <p>
                <strong className="text-white">Improvement:</strong> To improve our services, develop new features, and enhance user experience.
              </p>
              <p>
                <strong className="text-white">Communication:</strong> To respond to your inquiries and provide customer support.
              </p>
              <p>
                <strong className="text-white">Analytics:</strong> To analyze usage patterns and optimize our website performance.
              </p>
              <p>
                <strong className="text-white">Legal Compliance:</strong> To comply with applicable laws and regulations.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Third-Party Services:</strong> We use third-party services for analytics, hosting, and cryptocurrency data. These services have their own privacy policies.
              </p>
              <p>
                <strong className="text-white">Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights and safety.
              </p>
              <p>
                <strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.
              </p>
              <p>
                <strong className="text-white">No Sale:</strong> We do not sell, trade, or rent your personal information to third parties for marketing purposes.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Encryption:</strong> We use industry-standard encryption to protect your data during transmission and storage.
              </p>
              <p>
                <strong className="text-white">Access Controls:</strong> We implement strict access controls to ensure only authorized personnel can access your information.
              </p>
              <p>
                <strong className="text-white">Regular Updates:</strong> We regularly update our security measures to protect against new threats.
              </p>
              <p>
                <strong className="text-white">Incident Response:</strong> We have procedures in place to respond to security incidents and notify affected users when necessary.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Access:</strong> You have the right to access the personal information we hold about you.
              </p>
              <p>
                <strong className="text-white">Correction:</strong> You can request correction of inaccurate or incomplete information.
              </p>
              <p>
                <strong className="text-white">Deletion:</strong> You can request deletion of your personal information, subject to legal requirements.
              </p>
              <p>
                <strong className="text-white">Portability:</strong> You can request a copy of your data in a portable format.
              </p>
              <p>
                <strong className="text-white">Opt-out:</strong> You can opt out of certain data collection and processing activities.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Essential Cookies:</strong> We use essential cookies to provide basic website functionality.
              </p>
              <p>
                <strong className="text-white">Analytics Cookies:</strong> We use analytics cookies to understand how users interact with our website.
              </p>
              <p>
                <strong className="text-white">Third-Party Cookies:</strong> Third-party services may set cookies for analytics and functionality.
              </p>
              <p>
                <strong className="text-white">Cookie Management:</strong> You can control cookie settings through your browser preferences.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. International Data Transfers</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email: privacy@crypto-ai-insights.com</li>
                <li>Website: https://www.crypto-ai-insights.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



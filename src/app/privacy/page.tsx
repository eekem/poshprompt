import { createMetadata } from "@/lib/seo";
import Layout from "@/components/Layout";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description: "Learn how PoshPrompt protects your privacy and handles your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-mesh">
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none z-0 particle-bg"></div>
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark rounded-xl p-8 md:p-12">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-white text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-white/60 text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 text-white/80">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                <p className="leading-relaxed">
                  PoshPrompt ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our competitive AI prompt engineering platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    <strong className="text-white">2.1 Personal Information:</strong> When you create an account, we collect:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name and email address</li>
                    <li>Social media authentication data (Google, TikTok, Twitter)</li>
                    <li>Profile information you choose to provide</li>
                    <li>Payment information for premium features</li>
                  </ul>
                  
                  <p className="leading-relaxed mt-4">
                    <strong className="text-white">2.2 Usage Data:</strong> We automatically collect information about your interaction with the Service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Competition participation and performance metrics</li>
                    <li>Prompt submissions and responses</li>
                    <li>Experience points, levels, and achievements</li>
                    <li>IP address and device information</li>
                    <li>Browsing behavior and feature usage</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                <p className="leading-relaxed mb-4">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, operate, and maintain the Service</li>
                  <li>Process and facilitate competitions and reward distribution</li>
                  <li>Personalize your experience and improve our platform</li>
                  <li>Communicate with you about your account and competitions</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing</h2>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    <strong className="text-white">4.1 Public Information:</strong> Your username, rank, level, and competition statistics may be displayed publicly on leaderboards and profiles.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">4.2 Third-Party Services:</strong> We may share information with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Payment processors for transactions</li>
                    <li>Social media platforms for authentication</li>
                    <li>Analytics providers for usage insights</li>
                    <li>Cloud service providers for hosting</li>
                  </ul>
                  <p className="leading-relaxed">
                    <strong className="text-white">4.3 Legal Requirements:</strong> We may disclose your information if required by law or to protect our rights, property, or safety.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
                <p className="leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These include:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li>256-bit SSL encryption for data transmission</li>
                  <li>Secure password hashing and storage</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication systems</li>
                  <li>Secure data centers with 24/7 monitoring</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    <strong className="text-white">6.1 Essential Cookies:</strong> Required for basic functionality and security.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">6.2 Performance Cookies:</strong> Help us understand how visitors interact with our Service.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">6.3 Marketing Cookies:</strong> Used to deliver relevant advertisements and content.
                  </p>
                  <p className="leading-relaxed">
                    You can control cookie settings through your browser preferences.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
                <p className="leading-relaxed">
                  We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Your Rights</h2>
                <p className="leading-relaxed mb-4">Depending on your location, you may have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Request a copy of your data</li>
                  <li>Object to processing of your information</li>
                  <li>Request data portability</li>
                  <li>Restrict processing of your information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
                <p className="leading-relaxed">
                  Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. International Data Transfers</h2>
                <p className="leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to This Policy</h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Us</h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white">Email: privacy@poshprompt.com</p>
                  <p className="text-white">Website: www.poshprompt.com</p>
                  <p className="text-white">Address: [Your Business Address]</p>
                </div>
              </section>
            </div>

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Link 
                  href="/terms" 
                  className="text-primary hover:underline transition-colors"
                >
                  View Terms of Service
                </Link>
                <Link 
                  href="/" 
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

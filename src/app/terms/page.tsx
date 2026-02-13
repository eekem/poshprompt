import { createMetadata } from "@/lib/seo";
import Layout from "@/components/Layout";
import Link from "next/link";

export const metadata = createMetadata({
  title: "Terms of Service",
  description: "Read PoshPrompt's terms of service and user agreement.",
  path: "/terms",
});

export default function TermsPage() {
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
              <h1 className="text-white text-4xl font-bold mb-4">Terms of Service</h1>
              <p className="text-white/60 text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 text-white/80">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p className="leading-relaxed">
                  By accessing and using PoshPrompt ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                <p className="leading-relaxed mb-4">
                  PoshPrompt is a competitive arena for prompt engineers where users can:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Participate in real-time AI prompt engineering challenges</li>
                  <li>Compete with other users in skill-based competitions</li>
                  <li>Earn experience points and level up their ranking</li>
                  <li>Claim rewards and loot based on performance</li>
                  <li>Access premium features and content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    <strong className="text-white">3.1 Account Creation:</strong> You must provide accurate, complete, and current information when creating an account.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">3.3 Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
                <p className="leading-relaxed mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Submit prompts that contain illegal, harmful, or inappropriate content</li>
                  <li>Attempt to exploit or manipulate the competitive system</li>
                  <li>Use automated tools or bots to gain unfair advantages</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Reverse engineer or attempt to extract our source code</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    <strong className="text-white">5.1 Service Content:</strong> The Service and its original content, features, and functionality are owned by PoshPrompt and are protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">5.2 User Content:</strong> You retain ownership of prompts you create, but grant us a license to use, modify, and display your content for the purpose of operating and improving the Service.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Competition and Rewards</h2>
                <div className="space-y-4">
                  <p className="leading-relaxed">
                    <strong className="text-white">6.1 Fair Competition:</strong> All competitions are designed to be fair and skill-based. We reserve the right to disqualify participants who attempt to manipulate results.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-white">6.2 Rewards:</strong> Rewards and loot are distributed based on performance metrics and are subject to availability. Virtual rewards have no monetary value unless explicitly stated.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Privacy and Data</h2>
                <p className="leading-relaxed">
                  Your privacy is important to us. Please review our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which also governs your use of the Service, to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimers</h2>
                <p className="leading-relaxed">
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any kind, express or implied, regarding the operation or availability of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
                <p className="leading-relaxed">
                  In no event shall PoshPrompt, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, or other intangible losses, resulting from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
                <p className="leading-relaxed">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
                <p className="leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
                <p className="leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white">Email: legal@poshprompt.com</p>
                  <p className="text-white">Website: www.poshprompt.com</p>
                </div>
              </section>
            </div>

            {/* Navigation */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <Link 
                  href="/privacy" 
                  className="text-primary hover:underline transition-colors"
                >
                  View Privacy Policy
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

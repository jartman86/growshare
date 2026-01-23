import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Privacy Policy | GrowShare',
  description: 'GrowShare Privacy Policy - How we collect, use, and protect your information',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-green max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> January 2026
            </p>

            <p className="text-gray-700 mb-6">
              GrowShare ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Personal Information</h3>
              <p className="text-gray-700 mb-4">
                When you create an account or use our services, we may collect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Name and email address</li>
                <li>Profile photo</li>
                <li>Location information (city, state)</li>
                <li>Phone number (optional)</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Property details (for landowners)</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">
                When you access our platform, we automatically collect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Device information (browser type, operating system)</li>
                <li>IP address</li>
                <li>Usage data (pages visited, features used)</li>
                <li>Cookies and similar technologies</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">User-Generated Content</h3>
              <p className="text-gray-700">
                We collect content you voluntarily provide, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
                <li>Plot listings and descriptions</li>
                <li>Photos and images</li>
                <li>Messages between users</li>
                <li>Reviews and ratings</li>
                <li>Forum posts and comments</li>
                <li>Crop journal entries</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process transactions and send related information</li>
                <li>Connect landowners with renters</li>
                <li>Send you notifications and updates</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Improve our platform and user experience</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We may share your information with:
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Other Users</h3>
              <p className="text-gray-700 mb-4">
                Your profile information, listings, and reviews are visible to other users as part of the platform's functionality.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We share information with third-party services that help us operate our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>Clerk:</strong> Authentication services</li>
                <li><strong>Cloudinary:</strong> Image hosting</li>
                <li><strong>SendGrid:</strong> Email communications</li>
                <li><strong>OpenWeatherMap:</strong> Weather data</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Legal Requirements</h3>
              <p className="text-gray-700">
                We may disclose information when required by law, court order, or government request,
                or to protect the rights, property, or safety of GrowShare, our users, or others.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption of data in transit (HTTPS)</li>
                <li>Secure password hashing</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>PCI-compliant payment processing through Stripe</li>
              </ul>
              <p className="text-gray-700 mt-4">
                While we strive to protect your information, no method of transmission over the Internet
                is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your information:
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Access and Update</h3>
              <p className="text-gray-700 mb-4">
                You can access and update your profile information through your account settings.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Email Preferences</h3>
              <p className="text-gray-700 mb-4">
                You can manage your email notification preferences at{' '}
                <a href="/settings/notifications" className="text-green-600 hover:text-green-700">
                  /settings/notifications
                </a>.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Account Deletion</h3>
              <p className="text-gray-700 mb-4">
                You can request deletion of your account by contacting us. Note that some information
                may be retained for legal or legitimate business purposes.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Data Portability</h3>
              <p className="text-gray-700">
                You can request a copy of your data in a portable format by contacting us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Understand how you use our platform</li>
                <li>Improve our services</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookies through your browser settings, but disabling cookies may
                affect platform functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700">
                GrowShare is not intended for children under 18. We do not knowingly collect information
                from children. If you believe a child has provided us with personal information,
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. International Users</h2>
              <p className="text-gray-700">
                GrowShare is operated in the United States. If you access our platform from outside
                the US, your information may be transferred to and processed in the US, where data
                protection laws may differ from your country.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. California Privacy Rights</h2>
              <p className="text-gray-700 mb-4">
                California residents have additional rights under the CCPA:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Right to know what personal information is collected</li>
                <li>Right to request deletion of personal information</li>
                <li>Right to opt-out of sale of personal information (we do not sell personal information)</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of significant
                changes by posting the new policy on this page and updating the "Last Updated" date.
                We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Email:</strong> privacy@growshare.com<br />
                <strong>Address:</strong> GrowShare Inc., [Address to be added]
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata = {
  title: 'Terms of Service | GrowShare',
  description: 'GrowShare Terms of Service and User Agreement',
}

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-green max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> January 2026
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using GrowShare ("the Platform"), you agree to be bound by these Terms of Service ("Terms").
                If you do not agree to these Terms, please do not use the Platform.
              </p>
              <p className="text-gray-700">
                GrowShare is a marketplace that connects landowners with gardeners and farmers seeking land to cultivate.
                We provide the platform for these connections but are not a party to any agreements between users.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To use certain features of the Platform, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
                <li>Be at least 18 years old to create an account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Platform Services</h2>
              <p className="text-gray-700 mb-4">
                GrowShare provides the following services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Plot Listings:</strong> Landowners can list available land for rent</li>
                <li><strong>Booking System:</strong> Renters can request and book plots</li>
                <li><strong>Marketplace:</strong> Users can buy and sell produce and gardening supplies</li>
                <li><strong>Tool Rentals:</strong> Users can rent gardening tools from other users</li>
                <li><strong>Community Forums:</strong> Users can participate in discussions</li>
                <li><strong>Messaging:</strong> Direct communication between users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Landowner Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                If you list property on GrowShare, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Have legal authority to rent the property</li>
                <li>Provide accurate descriptions and images</li>
                <li>Disclose any known hazards or restrictions</li>
                <li>Maintain the property in a safe condition</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Honor confirmed bookings unless cancelled according to policy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Renter Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                If you rent property through GrowShare, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use the property only for agreed-upon purposes</li>
                <li>Respect property boundaries and rules</li>
                <li>Not damage or alter the property without permission</li>
                <li>Make timely payments as agreed</li>
                <li>Leave the property in good condition</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Payments and Fees</h2>
              <p className="text-gray-700 mb-4">
                GrowShare uses Stripe to process payments. By using our payment services, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>GrowShare charges a 10% service fee on all transactions</li>
                <li>Landowners receive payments after successful booking completion</li>
                <li>Refunds are subject to our cancellation policy</li>
                <li>You are responsible for any applicable taxes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cancellation Policy</h2>
              <p className="text-gray-700 mb-4">
                Cancellations are subject to the following terms:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Renters may cancel pending bookings at any time</li>
                <li>Cancellation of approved bookings before payment incurs no fee</li>
                <li>Cancellation after payment may result in partial refund based on timing</li>
                <li>Landowners who cancel confirmed bookings may face penalties</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">
                You may not use GrowShare to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Post false or misleading information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to bypass security measures</li>
                <li>Use automated systems to access the Platform</li>
                <li>Engage in any illegal cultivation activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                GrowShare is a platform that connects users. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>The condition or safety of any listed property</li>
                <li>Disputes between landowners and renters</li>
                <li>Quality of produce sold in the marketplace</li>
                <li>Condition of rented tools</li>
                <li>Any losses, damages, or injuries resulting from platform use</li>
              </ul>
              <p className="text-gray-700 mt-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, GROWSHARE SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless GrowShare, its officers, directors, employees,
                and agents from any claims, damages, losses, or expenses arising from your use of the
                Platform or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                Any disputes arising from these Terms or your use of GrowShare will be resolved through:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Good faith negotiation between parties</li>
                <li>Mediation if negotiation fails</li>
                <li>Binding arbitration as a last resort</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700">
                We may update these Terms from time to time. We will notify users of significant changes
                via email or platform notification. Continued use of GrowShare after changes constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Termination</h2>
              <p className="text-gray-700">
                We reserve the right to suspend or terminate your account at any time for violation of
                these Terms or for any other reason at our discretion. You may also delete your account
                at any time through your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700">
                If you have questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Email:</strong> legal@growshare.co<br />
                <strong>Address:</strong> GrowShare, Nebo, NC 28671
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

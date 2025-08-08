const TermsOfServicePage = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 mt-15 text-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold mb-6">Terms of Service for MicroBridge</h1>
      <p className="italic mb-6">Effective Date: July 30, 2025</p>

      <p className="mb-6">
        Welcome to MicroBridge! These Terms of Service ("Terms") govern your access to and use of the MicroBridge website, platform, and services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use the Service.
      </p>

      <p className="mb-6">
        MicroBridge is a platform that connects university students ("Students") with startups and small-to-medium enterprises ("Employers") for short-term, paid projects ("Projects" or "Micro-Internships").
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Eligibility</h2>
      <p className="mb-6">
        To use the Service, you must be at least 18 years old and capable of entering into a binding contract. Students must be currently enrolled at a university in Hong Kong or have graduated within the last 12 months. Employers must be legitimate businesses or authorized representatives. We reserve the right to verify all eligibility claims.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. Account Registration</h2>
      <p className="mb-6">
        You must register to access the Service. You agree to provide accurate and up-to-date information and to safeguard your login credentials. You are responsible for all activities that occur under your account.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. User Conduct</h2>
      <p className="mb-2">You agree not to:</p>
      <ul className="list-disc list-inside mb-6">
        <li>Post or apply to unlawful, fraudulent, or misleading projects</li>
        <li>Harass, harm, or abuse other users</li>
        <li>Infringe on intellectual property</li>
        <li>Circumvent our payment system</li>
        <li>Use the Service for unintended purposes</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Payments & Fees</h2>
      <p className="mb-6">
        Employers agree to pay project fees, which are held in escrow via Stripe Connect. MicroBridge charges a 10% commission on project payments. Students receive payment upon project approval. Employers can also subscribe to a “Pro” plan for additional features.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Projects & Disputes</h2>
      <p className="mb-6">
        Students must complete projects as agreed. Employers must give clear instructions. If disputes arise, both parties agree to try resolving them directly. If that fails, MicroBridge will intervene and make a final decision.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">6. Intellectual Property</h2>
      <p className="mb-6">
        You retain rights to your content. By using the Service, you grant MicroBridge a non-exclusive license to use submitted content for service operation and promotion. Project IP rights transfer to Employers upon full payment, unless otherwise agreed.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">7. Third-Party Links & Services</h2>
      <p className="mb-6">
        We are not responsible for third-party websites or services linked on the platform. Use them at your own risk.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">8. Disclaimers</h2>
      <p className="mb-6">
        The Service is provided “as is.” We do not guarantee uninterrupted or error-free operation. We are not liable for issues arising from user agreements or third-party services.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">9. Limitation of Liability</h2>
      <p className="mb-6">
        To the maximum extent permitted by law, MicroBridge is not liable for indirect or consequential damages, loss of data, profits, or goodwill, even if advised of such damages.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">10. Governing Law</h2>
      <p className="mb-6">
        These Terms are governed by the laws of the Hong Kong SAR. Any legal disputes will be handled exclusively in Hong Kong courts.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">11. Changes to the Terms</h2>
      <p className="mb-6">
        We may update these Terms at any time. Significant changes will be posted. Continued use of the Service means you accept the new Terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">12. Contact Us</h2>
      <p className="mb-2">[Your Name]</p>
      <p className="mb-2">Email: <a href="mailto:your@email.com" className="underline text-primary">your@email.com</a></p>
      <p className="mb-2">Phone: [Your Phone Number]</p>
    </main>
  );
};

export default TermsOfServicePage;

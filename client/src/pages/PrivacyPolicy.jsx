import React from "react";
import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05051A] via-[#17104A] to-[#9D174D] px-4 py-10 md:py-14">

      <div className="max-w-4xl mx-auto bg-[#0b0925]/95 backdrop-blur-xl border border-fuchsia-500/20 rounded-3xl p-6 md:p-10 lg:p-12 shadow-2xl shadow-fuchsia-950/40">

        {/* Header */}
        <div className="border-b border-white/10 pb-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Privacy Policy
          </h1>

          <p className="text-slate-400 text-sm">
            Last updated: August 28, 2026
          </p>
        </div>

        <div className="space-y-9 text-slate-300 text-[15px] md:text-base leading-7">

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              1. Introduction
            </h2>

            <p>
              Welcome to <span className="text-fuchsia-300 font-medium">Intervia.AI</span>.
              We value your privacy and are committed to protecting the
              personal information you provide when using our AI-powered
              interview preparation platform. This Privacy Policy explains
              what information we collect, how we use it, and the choices
              available to you.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              2. Information We Collect
            </h2>

            <p className="mb-3">
              Depending on how you use Intervia.AI, we may collect information
              that you voluntarily provide or that is generated through your
              use of the platform, including:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>Name and email address</li>
              <li>Account and authentication information</li>
              <li>Interview questions, responses, and performance data</li>
              <li>Interview history and generated reports</li>
              <li>Payment and transaction-related information</li>
              <li>Technical and usage information necessary to operate the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              3. How We Use Your Information
            </h2>

            <p className="mb-3">
              We use the information we collect for legitimate business and
              service-related purposes, including to:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>Create and maintain your account</li>
              <li>Provide and personalize AI-powered interview experiences</li>
              <li>Analyze interview performance and generate feedback</li>
              <li>Improve the functionality, quality, and reliability of our platform</li>
              <li>Process payments and manage purchased services</li>
              <li>Prevent fraud, abuse, and unauthorized access</li>
              <li>Communicate important information about your account or our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              4. Data Security
            </h2>

            <p>
              We implement reasonable technical and organizational safeguards
              designed to protect your information from unauthorized access,
              alteration, disclosure, or destruction. However, no method of
              transmission or electronic storage is completely secure, and
              we cannot guarantee absolute security of your information.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              5. Third-Party Services
            </h2>

            <p>
              We may rely on trusted third-party providers for services such
              as authentication, payment processing, cloud hosting, analytics,
              database infrastructure, and AI-related functionality. These
              providers may process information on our behalf and are subject
              to their own terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              6. Cookies and Similar Technologies
            </h2>

            <p>
              Intervia.AI may use cookies and similar technologies to maintain
              user sessions, remember preferences, provide essential platform
              functionality, understand how the service is used, and improve
              the overall user experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              7. Data Retention
            </h2>

            <p>
              We retain information for as long as reasonably necessary to
              provide our services, maintain business and transaction records,
              fulfill legal obligations, resolve disputes, and enforce our
              agreements. When information is no longer required, we may
              securely delete or anonymize it where appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              8. Your Privacy Rights
            </h2>

            <p>
              Depending on your location and applicable law, you may have
              certain rights concerning your personal information, including
              the right to request access, correction, deletion, or restriction
              of processing. You may also have additional rights provided by
              applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              9. Children's Privacy
            </h2>

            <p>
              Intervia.AI is not intended to knowingly collect personal
              information from children where such collection is restricted
              by applicable law. If you believe that a child has provided
              personal information to us without appropriate consent, please
              contact us so that we can take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              10. Changes to This Privacy Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time to reflect
              changes to our services, technology, legal requirements, or
              business practices. Any updated version will be published on
              this page along with a revised "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">
              11. Contact Us
            </h2>

            <p>
              If you have questions, concerns, or requests regarding this
              Privacy Policy or how your information is handled, please
              contact us through our Contact Us page.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-7 border-t border-white/10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-fuchsia-300 hover:text-white font-medium transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default PrivacyPolicy;

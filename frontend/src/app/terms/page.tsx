'use client';

import React, { useEffect } from 'react';
import { CheckCircle, Copyright, User, DollarSign, RefreshCcw, AlertTriangle, Shield, Gavel } from 'lucide-react';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    // Fade-in effect on page load
    const container = document.querySelector('.container');
    if (container) {
      container.classList.add('fade-in');
    }

    // scroll effect
    const sections = document.querySelectorAll('.scroll-section');
    const handleScroll = () => {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
        section.classList.toggle('active', isVisible);
        section.classList.toggle('inactive', !isVisible);
        if (isVisible) {
          (section as HTMLElement).style.transform = `translateY(0) scale(1)`;
          (section as HTMLElement).style.opacity = '1';
        } else {
          (section as HTMLElement).style.transform = `translateY(15px) scale(0.99)`;
          (section as HTMLElement).style.opacity = '0.95';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-6 py-12 text-white">
      <style jsx>{`
        .container {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeIn 1s ease-in forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scroll-section {
          transition: transform 0.5s ease-out, opacity 0.5s ease-out;
        }
        .scroll-section.active {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        .scroll-section.inactive {
          transform: translateY(15px) scale(0.99);
          opacity: 0.95;
        }
      `}</style>
      <div className="text-center mb-12 scroll-section">
        <h1 className="text-4xl font-bold tracking-tight [text-shadow:0_2px_4px_rgba(0,0,0,0.1)]">
          Terms of Service
        </h1>
        <p className="text-sm text-white/60 mt-2">Last Updated: July 26, 2025</p>
      </div>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        </div>
        <p className="text-base leading-relaxed">
          By accessing this website or using any GitSync service, you agree to be bound by these Terms and Conditions of Use, all applicable laws, and regulations. You are responsible for compliance with any local laws. If you do not agree with these terms, you may not use this site or its services.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Copyright className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">2. Copyright & Intellectual Property</h2>
        </div>
        <p className="text-base leading-relaxed">
          All content, including the site design, branding, logos, and proprietary materials, are © {new Date().getFullYear()} GitSync. You may not reproduce, distribute, modify, or create derivative works without express permission. GitSync complies with DMCA standards. To file a claim, contact us at{' '}
          <a
            className="text-white/80 hover:text-white underline transition-colors duration-200"
            href="mailto:gitsync@gmail.com"
          >
            gitsync@gmail.com
          </a>.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">3. Account Usage</h2>
        </div>
        <p className="text-base leading-relaxed">
          By signing up using GitHub or Google authentication, you authorize GitSync to collect and use your basic profile information for account identification. By signing up, you also consent to receive system emails. Promotional communications can be opted out at any time via provided links.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">4. Membership and Billing</h2>
        </div>
        <p className="text-base leading-relaxed">
          If GitSync offers paid subscriptions in the future, fees will be clearly disclosed. Any recurring billing or one-time charges will begin only upon explicit user action and confirmation. At this time, GitSync is offered free of charge.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCcw className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">5. Refund Policy</h2>
        </div>
        <p className="text-base leading-relaxed">
          Refunds are not applicable for free services. Should GitSync introduce paid services, policies related to refunds will be published at that time. Errors in billing can be reported to{' '}
          <a
            className="text-white/80 hover:text-white underline transition-colors duration-200"
            href="mailto:gitsync@gmail.com"
          >
            gitsync@gmail.com
          </a>.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">6. Disclaimer</h2>
        </div>
        <p className="text-base leading-relaxed">
          All materials and services provided by GitSync are offered “as is.” GitSync makes no warranties, express or implied, including but not limited to fitness for a particular purpose or non-infringement. We do not guarantee service availability, uptime, or content accuracy.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">7. Limitations</h2>
        </div>
        <p className="text-base leading-relaxed">
          GitSync shall not be liable for any damages arising from the use or inability to use the materials on its platform. This includes but is not limited to loss of data, revenue, or service interruptions. These limitations may not apply in jurisdictions that do not permit exclusions of implied warranties.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Gavel className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">8. Governing Law</h2>
        </div>
        <p className="text-base leading-relaxed">
          These Terms are governed by and construed in accordance with the laws of the Province of Québec and the federal laws of Canada applicable therein, without regard to conflict of law provisions. Any disputes shall be subject to the exclusive jurisdiction of the courts located in Québec, Canada.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
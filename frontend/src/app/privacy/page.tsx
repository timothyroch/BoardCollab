'use client';

import React, { useEffect } from 'react';
import { Shield, User, Database, Share2, Globe, Clock, Lock, Mail, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-white/60 mt-2">Last Updated: July 26, 2025</p>
      </div>

      <section className="mb-12 scroll-section">
        <p className="text-base leading-relaxed">
          GitSync is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our services.
        </p>
        <p className="mt-4 text-base leading-relaxed">
          If you do not agree with this policy, please do not use GitSync or its associated services.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
        </div>
        <div className="space-y-4 text-base leading-relaxed">
          <p>
            <strong>1.1 Information You Provide Directly:</strong> We collect your name, email address, and profile information through Google and GitHub login. We also store content you submit, such as tasks, comments, and workspace data.
          </p>
          <p>
            <strong>1.2 Information Collected Automatically:</strong> We log your IP address, browser type, device information, and timestamps. We do not currently use cookies or tracking pixels.
          </p>
          <p>
            <strong>1.3 OAuth Authentication:</strong> GitSync integrates with Google and GitHub OAuth services, which may collect additional data per their privacy policies.
          </p>
        </div>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
        </div>
        <ul className="list-none space-y-3 text-base leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="h-2 w-2 mt-2 bg-white/60 rounded-full" />
            To provide core platform features like login, collaboration, and task management.
          </li>
          <li className="flex items-start gap-2">
            <span className="h-2 w-2 mt-2 bg-white/60 rounded-full" />
            To communicate service updates or respond to support inquiries.
          </li>
          <li className="flex items-start gap-2">
            <span className="h-2 w-2 mt-2 bg-white/60 rounded-full" />
            To analyze system performance and ensure reliability.
          </li>
          <li className="flex items-start gap-2">
            <span className="h-2 w-2 mt-2 bg-white/60 rounded-full" />
            To detect, investigate, and prevent fraud or abuse.
          </li>
        </ul>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Share2 className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">3. Data Sharing</h2>
        </div>
        <p className="text-base leading-relaxed">
          We do not sell your personal data. We share limited data only with:
        </p>
        <ul className="list-none mt-3 space-y-3 text-base leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="h-2 w-2 mt-2 bg-white/60 rounded-full" />
            Trusted infrastructure providers (e.g., hosting and storage).
          </li>
          <li className="flex items-start gap-2">
            <span className="h-2 w-2 mt-2 bg-white/60 rounded-full" />
            OAuth providers like Google and GitHub for login purposes.
          </li>
          <li className="flex items-start gap-2">
            <span className="h-2 w-2 mt-2 bg-white/60 rounded-full" />
            Legal authorities if required by applicable law.
          </li>
        </ul>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">4. Third-Party Services</h2>
        </div>
        <p className="text-base leading-relaxed">
          GitSync integrates with Google and GitHub. We are not responsible for their privacy practices. Please review their respective privacy policies.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">5. Data Retention</h2>
        </div>
        <p className="text-base leading-relaxed">
          We retain your data only as long as necessary to operate the service. You can request account deletion at any time.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">6. Children’s Privacy</h2>
        </div>
        <p className="text-base leading-relaxed">
          GitSync is not intended for users under 13 years old. We do not knowingly collect data from children. If you believe a child has submitted personal data, contact us, and we will remove it.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">7. Your Rights</h2>
        </div>
        <p className="text-base leading-relaxed">
          You may access, modify, or delete your personal data. To exercise these rights, contact us directly.
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
        </div>
        <p className="text-base leading-relaxed">
          For questions or privacy-related concerns, email us at:{' '}
          <a
            className="text-white/80 hover:text-white underline transition-colors duration-200"
            href="mailto:gitsync@gmail.com"
          >
            gitsync@gmail.com
          </a>
        </p>
      </section>

      <section className="mb-12 scroll-section">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-white/80" />
          <h2 className="text-2xl font-semibold">9. Changes to This Policy</h2>
        </div>
        <p className="text-base leading-relaxed">
          This Privacy Policy may be updated periodically. We will notify users of significant changes via our site or email.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
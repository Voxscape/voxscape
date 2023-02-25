import { ReactElement } from 'react';

const contactEmail = 'admin-at-voxscape-dot-io';
export function PrivacyPolicy(): ReactElement {
  return (
    <div>
      <div>
        <p>
          Thank you for visiting our website or using our services. We understand that your privacy is important, and we
          want to ensure that your personal information is protected. This Privacy Policy explains how we collect, use,
          and share your personal information when you use our website or services.
        </p>
        <hr />
        <h3>1. Information We Collect</h3>
        <p>
          We collect personal information that you provide to us when you use our website or services, such as your
          name, email address, postal address, phone number, and payment information. We may also collect information
          about your use of our website or services, such as your IP address, browser type, and operating system.
        </p>
        <h3>2. How We Use Your Information</h3>
        <p>
          We may use your personal information to provide you with our services, communicate with you about your account
          or our services, and to send you marketing communications about our services. We may also use your information
          to improve our website or services, to prevent fraud or other illegal activities, and to comply with legal
          requirements.
        </p>
        <h3>3. How We Share Your Information</h3>
        <p>
          We may share your personal information with third-party service providers who help us provide our services,
          such as payment processors, email providers, and hosting services. We may also share your information with our
          affiliates and partners for marketing purposes. We may disclose your information to law enforcement agencies
          or other governmental authorities if we believe that it is necessary to comply with a legal obligation or to
          protect our rights or the rights of others.
        </p>
        <h3>4. Cookies and Other Tracking Technologies</h3>
        <p>
          We may use cookies and other tracking technologies to collect information about your use of our website or
          services. Cookies are small data files that are stored on your device when you visit our website or use our
          services. We use cookies to personalize your experience, to remember your preferences, and to analyze how our
          website and services are used.
        </p>
        <h3>5. Your Rights</h3>
        <p>
          You have the right to access, correct, or delete your personal information that we hold about you. You may
          also object to our processing of your personal information or request that we restrict our processing of your
          personal information. To exercise these rights, please contact us using the contact details provided below.
        </p>
        <h3>6. Changes to This Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. We will post any changes to this Policy on our website,
          and the changes will be effective when posted.
        </p>
        <hr />
        <p>
          If you have any questions or concerns about this Privacy Policy or our practices, please contact us at
          {contactEmail}.
        </p>
      </div>
    </div>
  );
}

export function UserAgreement(): ReactElement {
  return (
    <div>
      <h1>User Agreement</h1>
      <p>
        Welcome to our social networking website! Before you begin using our services, please read this User Agreement
        carefully. By using our website, you agree to comply with these terms and conditions.
      </p>
      <h2>1. Eligibility</h2>
      <p>
        To use our website, you must be at least 18 years of age. If you are under 18 years old, you must have parental
        or guardian consent to use our website. By using our website, you represent and warrant that you have the legal
        capacity to enter into this Agreement and that you are not prohibited from using our website by any applicable
        laws.
      </p>
      <h2>2. User Content</h2>
      <p>
        You are solely responsible for any content that you post, upload, or otherwise make available on our website,
        including text, images, videos, and audio recordings. You represent and warrant that you have all necessary
        rights and permissions to use and post such content on our website, and that the content does not infringe on
        any third party rights, including copyright, trademark, privacy, or publicity rights.
      </p>
      <h2>3. Prohibited Activities</h2>
      <p>
        You agree not to engage in any activity that violates these terms and conditions or any applicable laws,
        including but not limited to:
      </p>
      <ul>
        <li>Posting content that is defamatory, libelous, obscene, or otherwise offensive;</li>
        <li>Using our website to harass, bully, or intimidate other users;</li>
        <li>Posting content that infringes on any third-party intellectual property rights;</li>
        <li>Impersonating another person or entity;</li>
        <li>Using our website to distribute spam, malware, or other harmful software;</li>
        <li>Collecting or harvesting information about other users without their consent;</li>
        <li>Using our website to engage in any illegal activities.</li>
      </ul>
      <h2>4. Intellectual Property Rights</h2>
      <p>
        All content and materials on our website, including text, images, videos, and audio recordings, are owned by us
        or our licensors and are protected by copyright, trademark, and other intellectual property laws. You agree not
        to use our content or materials in any way that violates these laws or infringes on our rights or the rights of
        our licensors.
      </p>
      <h2>5. Termination</h2>
      <p>
        We may terminate your access to our website at any time for any reason, including but not limited to violation
        of these terms and conditions or any applicable laws. Upon termination, you must immediately cease all use of
        our website and any content or materials obtained from our website.
      </p>
      <h2>6. Disclaimer of Warranties</h2>
      <p>
        Our website is provided "as is" without any warranties of any kind, express or implied. We do not warrant that
        our website will be error-free or uninterrupted, or that any defects will be corrected. We disclaim all
        warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and
        non-infringement.
      </p>
      <h2>7. Limitation of Liability</h2>
      <p>
        We will not be liable for any damages arising from your use of our website, including but not limited to direct,
        indirect, incidental, punitive, and consequential damages. Our liability to you for any claims arising from
        these terms and conditions or your use of our website will be limited to the amount paid by you, if any, to use
        our website.
      </p>
      <h2>8. Indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold us harmless from any claims, damages, and expenses (including
        attorneys' fees) arising from your use of our website or your violation of these terms and conditions.
      </p>
      <h2>9. Governing Law</h2>
      <p>
        These terms and conditions will be governed by and construed in accordance with the laws of [state or country],
        without giving effect to any principles of conflicts of law.
      </p>
      <h2>10. Changes to this Agreement</h2>
      <p>
        We may update this User Agreement from time to time. We will post any changes to this Agreement on our website,
        and the changes will be effective when posted.
      </p>
      <p>If you have any questions or concerns about this User Agreement, please contact us at {contactEmail}.</p>
    </div>
  );
}

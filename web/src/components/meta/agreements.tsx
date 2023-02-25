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
  return <div></div>;
}

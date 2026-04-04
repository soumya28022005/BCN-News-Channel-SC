import LegalLayout from "@/components/layout/LegalLayout";

export const metadata = {
  title: "Privacy Policy | The Bengal Chronicle",
};

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>The Bengal Chronicle Network (BCN) respects your privacy and is committed to protecting your personal data.</p>
      
      <h3 className="text-white text-xl font-bold mt-6 mb-2">1. Information We Collect</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>IP address, browser, device information</li>
        <li>Email (if subscribed)</li>
        <li>User interactions and analytics data</li>
      </ul>

      <h3 className="text-white text-xl font-bold mt-6 mb-2">2. How We Use Data</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Improve user experience</li>
        <li>Provide personalized content</li>
        <li>Serve advertisements (Google AdSense)</li>
      </ul>

      <h3 className="text-white text-xl font-bold mt-6 mb-2">3. Cookies & Third Party</h3>
      <p>We use cookies to enhance functionality and advertising experience. We use third-party services like Google Analytics and Google AdSense.</p>

      <h3 className="text-white text-xl font-bold mt-6 mb-2">4. Data Retention & Legal Compliance</h3>
      <p>We retain user data only as long as necessary for operational and legal purposes. We comply with the Information Technology Act, 2000 (India).</p>
    </LegalLayout>
  );
}
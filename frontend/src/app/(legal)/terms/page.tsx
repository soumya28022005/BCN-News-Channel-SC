import LegalLayout from "@/components/layout/LegalLayout";

export const metadata = {
  title: "Terms & Conditions | BCN - The Bengal Chronicle Network",
};

export default function TermsAndConditions() {
  return (
    <LegalLayout title="Terms & Conditions">
      <p>Welcome to The Bengal Chronicle Network (BCN). By accessing and using our website (www.bcnnetwork.in), you accept and agree to be bound by the terms and provision of this agreement.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">1. Acceptance of Terms</h3>
      <p>By accessing our content, you agree to comply with these Terms & Conditions and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">2. Intellectual Property Rights</h3>
      <p>All content published on BCN, including articles, images, graphics, logos, and videos, is the exclusive property of The Bengal Chronicle Network unless otherwise stated. Unauthorized reproduction, distribution, or copying of any material without prior written permission is strictly prohibited.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">3. User Conduct</h3>
      <p>When interacting with our platform (such as leaving comments), you agree not to post content that is:</p>
      <ul className="list-disc pl-5 mt-2 space-y-2">
        <li>Abusive, defamatory, or hateful towards any individual or community.</li>
        <li>Promoting illegal activities or containing spam.</li>
        <li>Violating the copyright or intellectual property of others.</li>
      </ul>
      <p className="mt-2">BCN reserves the right to remove any user-generated content that violates these rules and to block users who repeatedly offend.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">4. Limitation of Liability</h3>
      <p>BCN shall not be held liable for any direct, indirect, incidental, or consequential damages arising out of the use or inability to use the information provided on this website.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">5. Governing Law</h3>
      <p>These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Kolkata, West Bengal.</p>
    </LegalLayout>
  );
}
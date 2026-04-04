import LegalLayout from "@/components/layout/LegalLayout";

export const metadata = {
  title: "Advertising Policy | BCN - The Bengal Chronicle Network",
};

export default function AdvertisingPolicy() {
  return (
    <LegalLayout title="Advertising Policy">
      <p>The Bengal Chronicle Network (BCN) relies on advertising revenue to sustain our high-quality journalism and keep our news free for readers. Our advertising policy is designed to ensure transparency, maintain editorial independence, and provide a safe experience for our users.</p>

      <h3 className="text-[#D4AF37] text-xl font-bold mt-8 mb-3">1. Editorial Independence</h3>
      <p>Our editorial and advertising departments operate strictly independently. Advertisers, sponsors, and partners have absolutely no influence over our editorial decisions, content, or news coverage. Paid content is never disguised as independent journalism.</p>

      <h3 className="text-[#D4AF37] text-xl font-bold mt-8 mb-3">2. Sponsored Content & Native Ads</h3>
      <p>Any content that is sponsored, provided by, or paid for by a third party will be clearly and unambiguously labeled as "Sponsored," "Promoted," or "Advertisement." We ensure our readers can easily distinguish between editorial content and advertising.</p>

      <h3 className="text-[#D4AF37] text-xl font-bold mt-8 mb-3">3. Prohibited Advertisements</h3>
      <p>We strictly prohibit and do not accept advertisements that are:</p>
      <ul className="list-disc pl-5 mt-2 space-y-2">
        <li>False, misleading, or deceptive.</li>
        <li>Promoting illegal products, services, or activities.</li>
        <li>Containing hateful, discriminatory, or offensive material.</li>
        <li>Violating third-party intellectual property rights.</li>
      </ul>

      <h3 className="text-[#D4AF37] text-xl font-bold mt-8 mb-3">4. Third-Party Ad Networks</h3>
      <p>We use third-party advertising companies, such as Google AdSense, to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>

      <h3 className="text-[#D4AF37] text-xl font-bold mt-8 mb-3">5. Ad Placements</h3>
      <p>Ads are placed in designated areas on our website and are designed not to disrupt the user's reading experience. BCN reserves the right to refuse or remove any advertisement at our sole discretion without prior notice.</p>
    </LegalLayout>
  );
}
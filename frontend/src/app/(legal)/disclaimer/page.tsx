import LegalLayout from "@/components/layout/LegalLayout";

export const metadata = {
  title: "Disclaimer | BCN - The Bengal Chronicle Network",
};

export default function Disclaimer() {
  return (
    <LegalLayout title="Disclaimer">
      <p>The information provided by The Bengal Chronicle Network (BCN) on www.bcnnetwork.in is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">1. No Professional Advice</h3>
      <p>The news, articles, and content published on BCN do not constitute financial, legal, medical, or other professional advice. Before making any decisions based on our content, we strongly recommend you consult with appropriate professionals.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">2. External Links Disclaimer</h3>
      <p>Our website may contain links to external websites that are not provided or maintained by or in any way affiliated with BCN. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">3. Views Expressed</h3>
      <p>Any views or opinions represented in opinion pieces, op-eds, or guest columns belong solely to the original authors and do not necessarily represent those of The Bengal Chronicle Network, its staff, or its management.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">4. Errors and Omissions</h3>
      <p>While we strive to ensure that the information we publish is accurate and up-to-date, errors can occasionally occur. BCN assumes no responsibility or liability for any errors or omissions in the content of this site.</p>
    </LegalLayout>
  );
}
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata = {
  title: "Editorial Policy | BCN - The Bengal Chronicle Network",
};

export default function EditorialPolicy() {
  return (
    <LegalLayout title="Editorial Policy">
      <p>The Bengal Chronicle Network (BCN) is committed to the highest standards of journalism. Our editorial policy serves as the guiding principle for our reporters, editors, and contributors to ensure we deliver accurate, unbiased, and responsible news to our readers.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">1. Truth and Accuracy</h3>
      <p>Accuracy is the core of our journalism. We verify facts before publishing and strive to present the truth without distortion. Rumors and unverified information are strictly labeled as such or not published at all.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">2. Independence and Impartiality</h3>
      <p>BCN operates independently of political parties, corporate interests, and external pressures. Our reporting is impartial, ensuring that multiple perspectives are presented fairly, especially in matters of public controversy.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">3. Corrections and Clarifications</h3>
      <p>We are transparent about our mistakes. If an error is published, it is our policy to correct it promptly and prominently. Readers are encouraged to reach out to us if they spot factual inaccuracies.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">4. Plagiarism</h3>
      <p>BCN has a zero-tolerance policy towards plagiarism. All content produced must be original. When using information from other sources, proper credit and attribution are mandatorily provided.</p>

      <h3 className="text-white text-xl font-bold mt-8 mb-3">5. Privacy and Sensitivity</h3>
      <p>We respect the privacy of individuals. When reporting on sensitive topics, tragedies, or matters involving minors, we exercise extreme caution to avoid unnecessary harm or distress, adhering to standard journalistic ethics.</p>
    </LegalLayout>
  );
}
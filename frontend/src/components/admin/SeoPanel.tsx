interface SeoPanelProps {
  seoTitle: string;
  seoDescription: string;
  onChange: (key: string, val: string) => void;
}

export default function SeoPanel({ seoTitle, seoDescription, onChange }: SeoPanelProps) {
  return (
    <div className="bg-[#111118] border border-[#1E1E2E] rounded-lg p-4 space-y-3">
      <label className="text-[#64748B] text-xs uppercase tracking-wider block">SEO সেটিংস</label>
      <div>
        <label className="text-[#64748B] text-xs block mb-1.5">SEO শিরোনাম</label>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => onChange('seoTitle', e.target.value)}
          placeholder="SEO শিরোনাম"
          className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors"
        />
      </div>
      <div>
        <label className="text-[#64748B] text-xs block mb-1.5">SEO বিবরণ</label>
        <textarea
          value={seoDescription}
          onChange={(e) => onChange('seoDescription', e.target.value)}
          placeholder="SEO বিবরণ (১৫০-১৬০ অক্ষর)"
          rows={3}
          className="w-full bg-[#1E1E2E] text-[#E2E8F0] placeholder-[#64748B] border border-[#2E2E3E] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E53E3E] transition-colors resize-none"
        />
        <p className="text-xs text-[#64748B] mt-1">{seoDescription.length}/160</p>
      </div>
    </div>
  );
}